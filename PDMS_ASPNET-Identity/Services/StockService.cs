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

        if (stock is null) return null;

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

    public async Task<ResponseStockDTO?> GetStockByIdAsync(int StockId)
    {
        var stock = await _context.Stock
            .FirstOrDefaultAsync(s => s.Id == StockId);

        return stock is not null ? new ResponseStockDTO(stock) : null;
    }

    public async Task<ResponseStockDTO?> GetStockByBatchNumberAsync(string batchNumber)
    {
        var stock = await _context.Stock
            .FirstOrDefaultAsync(s => s.BatchNumber == batchNumber);

        return stock is not null ? new ResponseStockDTO(stock) : null;
    }

    public async Task<ResponseStockDTO> CreateStockAsync(ResponseStockDTO request)
    {
        Stock stock = request.ToEntity();

        _context.Stock.Add(stock);
        await _context.SaveChangesAsync();

        return new ResponseStockDTO(stock);
    }

    public async Task<bool> DeleteStockAsync(int id)
    {
        var stock = await _context.Stock.FirstOrDefaultAsync(s => s.Id == id);
        if (stock == null) return false;

        _context.Stock.Remove(stock);
        await _context.SaveChangesAsync();
        return true;
    }
}


