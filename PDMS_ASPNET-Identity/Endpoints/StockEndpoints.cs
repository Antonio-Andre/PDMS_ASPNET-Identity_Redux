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

            stock.MapGet("/", GetAllStock);
            stock.MapGet("/{id:int}", GetStockById);
            stock.MapGet("/batch/{batchNumber}", GetStockByBatchNumber);
            stock.MapPost("/", CreateStock);       
            stock.MapDelete("/{id:int}", DeleteStock);
        }

        public static async Task<IResult> GetAllStock([FromServices] StockService service)
        {
            var stock = await service.ShowStockAsync();
            return Results.Ok(stock);
        }

        public static async Task<IResult> GetStockById(int id, [FromServices] StockService stockService)
        {
            var stock = await stockService.GetStockByIdAsync(id);
            return stock is not null ? Results.Ok(stock) : Results.NotFound();
        }

        public static async Task<IResult> GetStockByBatchNumber(string BatchNumber, [FromServices] StockService service)
        {
            var stock = await service.GetBatchByIdAsync(BatchNumber);

            if (stock is null)
                return Results.NotFound(new { Message = $"Stock with Batch Number Of {BatchNumber} not found." });

            return Results.Ok(stock);
        }

        public static async Task<IResult> CreateStock(ResponseStockDTO request, [FromServices] StockService stockService)
        {
            var result = await stockService.CreateStockAsync(request);
            return Results.Created($"/api/stock/{result.Id}", result);
        }

        public static async Task<IResult> DeleteStock(int id, [FromServices] StockService stockService)
        {
            var success = await stockService.DeleteStockAsync(id);
            return success ? Results.Ok() : Results.NotFound();
        }
    }
}
