using Azure;
using Microsoft.EntityFrameworkCore;
using PDMS.Data;
using PDMS.DTO;
using PDMS.Models;

public class StockService
{
    private readonly ApplicationDbContext _context;
    public StockService(ApplicationDbContext context) => _context = context;
    public async Task<List<ResponseStockDTO>> ShowStockAsync(){
        var stock = await _context.Stock.ToListAsync();

        return stock
            .Select(s => new ResponseStockDTO
                (
                    s.Id,
                    s.BatchNumber,
                    s.Product,
                    s.Quantity,
                    s.Source,
                    s.SlaughterDate,
                    s.ProcessingDate,
                    s.ExpiryDate
                )
            ).ToList();
    }

    public async Task<ResponseStockDTO?> GetBatchByIdAsync(string BatchNumber)
    {
       var stock = await _context.Stock.FindAsync(BatchNumber);
        
        return new ResponseStockDTO
            (
                stock.Id,
                stock.BatchNumber,
                stock.Product,
                stock.Quantity,
                stock.Source,
                stock.SlaughterDate,
                stock.ProcessingDate,
                stock.ExpiryDate
            );
    }
}

