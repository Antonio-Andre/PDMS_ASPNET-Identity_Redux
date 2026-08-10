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
                .Include(s => s.ReturnedItems)
                .ToListAsync();

            return shipments.Select(ResponseShipmentDTO.FromEntity).ToList();
        }

        public async Task<ResponseShipmentDTO?> GetShipmentByRegNumberAsync(string regNumber)
        {
            var shipment = await _context.Deliveries
                .Include(s => s.Items)
                .Include(s => s.ReturnedItems)
                .FirstOrDefaultAsync(s => s.RegisterNumber == regNumber);

            if (shipment is null) return null;

            return ResponseShipmentDTO.FromEntity(shipment);
        }

        public async Task<List<ShipmentItemDTO>?> GetAllItemsAsync(string regNumber)
        {
            var shipment = await _context.Deliveries
                .Include(s => s.Items)
                .FirstOrDefaultAsync(s => s.RegisterNumber == regNumber);

            if (shipment is null) return null;

            return shipment.Items.Select(ShipmentItemDTO.FromEntity).ToList();
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
                    RegisterDate = DateTime.UtcNow
                };

                _context.Deliveries.Add(shipment);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return ResponseShipmentDTO.FromEntity(shipment);
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
                    throw new Exception($"Batch {itemDto.BatchNumber} not found in inventory.");
                }

                if (movement == TransferenceDirection.Outbound)
                {
                    if (batchInStock.Quantity < itemDto.Quantity)
                        throw new Exception($"Insufficient stock for batch {itemDto.BatchNumber}.");

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