
using PDMS.Models;

namespace PDMS.DTO
{
    public record ShipmentItemDTO
    (
        int Id,
        string BatchNumber,
        ProductType Product,
        int Quantity,
        int ShipmentId,
        decimal? ItemWeightKg
    );
}