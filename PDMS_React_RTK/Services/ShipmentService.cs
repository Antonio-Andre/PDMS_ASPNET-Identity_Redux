using Azure.Core;
using Microsoft.EntityFrameworkCore;
using PDMS.Data;
using PDMS.DTO;
using PDMS.Models;

namespace PDMS.Services
{
    public class ShipmentService
    {
        private readonly ApplicationDbContext _context;
        public ShipmentService(ApplicationDbContext context) => _context = context;

        public async Task<List<ResponseShipmentDTO>> GetAllShipmentsAsync()
        {
            var shipments = await _context.Deliveries
                .Include(s => s.Items)
                .ToListAsync();

            return shipments.Select(s => new ResponseShipmentDTO(
                s.Id,
                s.RegisterNumber,
                s.Movement,
                s.Status,
                s.Items.Select(i => new ShipmentItemDTO(
                    i.Id,
                    i.BatchNumber,
                    i.Product,
                    i.Quantity,
                    i.ShipmentId,
                    i.ItemWeightKg
                )).ToList(),
                s.RegisterData,
                s.SLAExpiration,
                s.DateOfDeliveryOrReturn,
                s.TotalShipmentWeightKg,
                s.DriverId,
                s.VanId,
                s.Observations
            )).ToList();
        }

        public async Task<ResponseShipmentDTO?> GetShipmentByRegNumberAsync(string regNumber)
        {
            var shipment = await _context.Deliveries
                .FirstOrDefaultAsync(s => s.RegisterNumber == regNumber);


            if (shipment is null) return null;

            return new ResponseShipmentDTO(
                shipment.Id,
                shipment.RegisterNumber,
                shipment.Movement,
                shipment.Status,
                shipment.Items.Select(i => new ShipmentItemDTO(
                    i.Id,
                    i.BatchNumber,
                    i.Product,
                    i.Quantity,
                    i.ShipmentId,
                    i.ItemWeightKg
                )).ToList(),
                shipment.RegisterData,
                shipment.SLAExpiration,
                shipment.DateOfDeliveryOrReturn,
                shipment.TotalShipmentWeightKg,
                shipment.DriverId,
                shipment.VanId,
                shipment.Observations ?? string.Empty
            );
        }

        public async Task<object?> GetAllItemsAsync(string regNumber)
        {
            var shipment = await _context.Deliveries
                .Include(s => s.Items)
                .FirstOrDefaultAsync(s => s.RegisterNumber == regNumber);


            if (shipment is null) return null;

            return shipment.Items.Select(i => new ShipmentItemDTO(
                    i.Id,
                    i.BatchNumber,
                    i.Product,
                    i.Quantity,
                    i.ShipmentId,
                    i.ItemWeightKg
                )).ToList();
        }

        public async Task<ResponseShipmentDTO> CreateShipmentAsync(CreateShipmentDTO request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var items = await MapAndValidateItemsAsync(request.Items, request.Movement);

                var shipment = new Shipment
                {
                    RegisterNumber = request.RegisterNumber,
                    Movement = request.Movement,
                    Status = DeliveryStatus.Registered,
                    Items = items,
                    TotalShipmentWeightKg = request.TotalShipmentWeightKg,
                    DriverId = request.DriverId,
                    VanId = request.VanId,
                    Observations = request.Observations ?? string.Empty,
                    RegisterData = DateTime.Now
                };

                _context.Deliveries.Add(shipment);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return MapToResponse(shipment);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        private async Task<List<ShipmentItem>> MapAndValidateItemsAsync(List<ShipmentItemDTO> itemsDto, TransferenceDirection movement)
        {
            var batchNumbers = itemsDto.Select(i => i.BatchNumber).ToList();

            var inventorySnapshot = await _context.Stock
                .Where(s => batchNumbers.Contains(s.BatchNumber))
                .ToDictionaryAsync(s => s.BatchNumber);

            var shipmentItems = new List<ShipmentItem>();

            foreach (var itemDto in itemsDto)
            {
                if (!inventorySnapshot.TryGetValue(itemDto.BatchNumber, out var batchInStock))
                {
                    throw new Exception($"Lote {itemDto.BatchNumber} não encontrado no sistema.");
                }

                if (movement == TransferenceDirection.Outbound)
                {
                    if (batchInStock.Quantity < itemDto.Quantity)
                        throw new Exception($"Stock insuficiente para saída do lote {itemDto.BatchNumber}");

                    batchInStock.Quantity -= itemDto.Quantity;
                }
                else
                {
                    batchInStock.Quantity += itemDto.Quantity;
                }

                shipmentItems.Add(new ShipmentItem
                {
                    BatchNumber = itemDto.BatchNumber,
                    Product = itemDto.Product,
                    Quantity = itemDto.Quantity,
                    ItemWeightKg = itemDto.ItemWeightKg
                });
            }

            return shipmentItems;
        }
        private ResponseShipmentDTO MapToResponse(Shipment s)
        {
            return new ResponseShipmentDTO(
                s.Id,
                s.RegisterNumber,
                s.Movement,
                s.Status,
                s.Items.Select(i => new ShipmentItemDTO(
                    i.Id,
                    i.BatchNumber,
                    i.Product,
                    i.Quantity,
                    i.ShipmentId,
                    i.ItemWeightKg
                )).ToList(),
                s.RegisterData,
                s.SLAExpiration,
                s.DateOfDeliveryOrReturn,
                s.TotalShipmentWeightKg,
                s.DriverId,
                s.VanId,
                s.Observations ?? string.Empty
            );
        }
        /*
        public async Task<ResponseShipmentDTO?> UpdateShipmentAsync(int id, UpdateShipmentDTO request)
        {
            var shipment = await _context.Deliveries
                .Include(s => s.Items)
                .FirstOrDefaultAsync(s => s.Id == id);
            if (shipment is null) return null;
            shipment.Movement = request.Movement;
            shipment.Status = request.Status;
            shipment.DateOfDeliveryOrReturn = request.DateOfDeliveryOrReturn;
            shipment.TotalShipmentWeightKg = request.TotalShipmentWeightKg;
            shipment.DriverId = request.DriverId;
            shipment.VanId = request.VanId;
            _context.ShipmentItems.RemoveRange(shipment.Items);
            var newItems = request.Items.Select(i => new ShipmentItem
            {
                BatchNumber = i.BatchNumber,
                Product = i.Product,
                Quantity = i.Quantity,
                ShipmentId = shipment.Id,
                ItemWeightKg = i.ItemWeightKg
            }).ToList();
            //isto nao altera a quantidade no stock, no entanto é preciso
            //senao há inconsistencias no sistema, ou seja, o stock nao reflete a realidade do que foi entregue ou recebido
            shipment.Items = newItems;
            await _context.SaveChangesAsync();
            return MapToResponse(shipment);

        }*/
        public async Task<bool> ConfirmDeliveryAsync(int id)
        {
            var shipment = await _context.Deliveries.FindAsync(id);

            if (shipment == null) return false;

            shipment.Status = DeliveryStatus.Delivered;
            shipment.DateOfDeliveryOrReturn = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteShipmentAsync(int id)
        {
            var shipment = await _context.Deliveries.FindAsync(id);
            if (shipment is null) return false;
            _context.Deliveries.Remove(shipment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}



