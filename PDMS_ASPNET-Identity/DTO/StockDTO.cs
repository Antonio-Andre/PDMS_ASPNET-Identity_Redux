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

    public record PagedStockResponseDTO(
    List<ResponseStockDTO> Items,
    int CurrentPage,
    int TotalPages,
    int TotalItems
);

    public record ConsumeBatchInputDTO(
        string BatchNumber,
        decimal QuantityConsumed
    );

    public record ProduceItemInputDTO(
        string BatchNumber,
        ProductType Product,
        decimal QuantityProduced,
        string Source,
        DateOnly? ProcessingDate,
        DateOnly ExpiryDate
    );

    public record CreateProductionLogDTO(
        int OperatorId,
        List<ConsumeBatchInputDTO> ConsumedBatches,
        List<ProduceItemInputDTO> ProducedItems,
        DateTime LogDate
    );

    public record UpdateStockDTO(
        string BatchNumber,
        ProductType Product,
        decimal Quantity,
        string Reason,
        string Observations,
        DateTime Date
    );
}
