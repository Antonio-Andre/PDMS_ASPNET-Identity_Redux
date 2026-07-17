using Microsoft.AspNetCore.Mvc;
using PDMS.DTO;
using PDMS.Models;
using PDMS.Services;


namespace PDMS.Endpoints
{
    public static class StockEndpoints
    {
        public static void RegisterStockEndpoints(this WebApplication app)
        {
            var stock = app.MapGroup("/api/stock").WithTags("Stock");

            stock.MapGet("/", ShowStock);
            //stock.MapGet("/{id}", ShowBatch);
        }

        public static async Task<IResult> ShowStock([FromServices] StockService service)
        {
            var stock = await service.ShowStockAsync();
            return Results.Ok(stock);
        }
        

        //Modificar id para batchNumber
        public static async Task<IResult> GetShipmentByBatchNumber(string BatchNumber, [FromServices] StockService service)
        {
            var stock = await service.GetBatchByIdAsync(BatchNumber);

            if (stock is null)
                return Results.NotFound(new { Message = $"Stock with Batch Number Of {BatchNumber} not found." });

            return Results.Ok(stock);
        }
    }
}
