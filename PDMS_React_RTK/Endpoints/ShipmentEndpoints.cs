using Microsoft.AspNetCore.Mvc;
using PDMS.DTO;
using PDMS.Models;
using PDMS.Services;


namespace PDMS.Endpoints
{
    public static class ShipmentEndpoints
    {
        public static void RegisterShipmentEndpoints(this WebApplication app)
        {
            var shipments = app.MapGroup("/api/shipments").WithTags("Shipments");

            shipments.MapGet("/", GetAllShipments);
            shipments.MapGet("/{regN}", GetShipmentByRegNumber);
            shipments.MapGet("/{regN}/items", GetAllItemsOfDelivery);
            shipments.MapPost("/", CreateShipment).RequireAuthorization(policy => policy.RequireRole("Admin"));
            shipments.MapPut("/{id:int}", ConfirmShipment).RequireAuthorization(policy => policy.RequireRole("Admin","Driver"));
        }

        public static async Task<IResult> GetAllShipments([FromServices] ShipmentService shipmentService)
        {
            var shipments = await shipmentService.GetAllShipmentsAsync();
            return Results.Ok(shipments);
        }
        
        public static async Task<IResult> GetShipmentByRegNumber(string registerNumber, [FromServices] ShipmentService shipmentService)
        {
            var shipment = await shipmentService.GetShipmentByRegNumberAsync(registerNumber);

            return Results.Ok(shipment);
        }

        public static async Task<IResult> GetAllItemsOfDelivery(string registerNumber, [FromServices] ShipmentService shipmentService)
        {
            var shipments = await shipmentService.GetAllItemsAsync(registerNumber);
            return Results.Ok(shipments);
        }

        public static async Task<IResult> CreateShipment(CreateShipmentDTO request, [FromServices] ShipmentService shipmentService)
        {
            var newShipment = await shipmentService.CreateShipmentAsync(request);
            return Results.Created($"/api/shipments/{newShipment.Id}", newShipment);
        }

        public static async Task<IResult> ConfirmShipment(int id, UpdateShipmentDTO request, [FromServices] ShipmentService shipmentService)
        {
            var success = await shipmentService.ConfirmDeliveryAsync(id);
            
            if (!success)
                return Results.NotFound(new { Message = "Shipment not found (process - update)." });
            
            return Results.NoContent();
        }



        /*public static async Task<IResult> CancelShipment(int id, [FromServices] ShipmentService shipmentService)
        {
            var success = await shipmentService.CancelAndRestoreStockAsync(id);

            if (!success)
                return Results.NotFound(new { Message = "Não foi possível cancelar o envio." });

            return Results.Ok(new { Message = "Envio cancelado e stock devolvido." });
        }*/ 
    }
}
