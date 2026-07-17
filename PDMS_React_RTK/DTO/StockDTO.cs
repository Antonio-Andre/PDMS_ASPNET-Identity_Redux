using PDMS.Models;

namespace PDMS.DTO
{
    public record ResponseStockDTO(
        int Id,
        string BatchNumber,
        ProductType Product, 
        decimal Quantity,
        string Source,
        DateOnly? SlaughterDate,
        DateOnly? ProcessingDate,
        DateOnly ExpiryDate
    );
}
