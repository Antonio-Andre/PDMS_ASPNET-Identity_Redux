using PDMS.Models;

namespace PDMS.DTO
{
    public record ResponseShipmentDTO(
        int Id,
        string RegisterNumber,
        TransferenceDirection Movement,
        DeliveryStatus Status,
        List<ShipmentItemDTO> Items,
        List<ReturnedItemDTO> ReturnedItems,
        DateTime RegisterData,
        DateTime SLAExpiration,
        DateTime? DateOfDeliveryOrReturn,
        decimal TotalShipmentWeightKg,
        int? DriverId, 
        int? VanId,
        string Observations
    );

    public record CreateShipmentDTO(
        string RegisterNumber,
        TransferenceDirection Movement,
        DeliveryStatus Status,
        List<ShipmentItemDTO> Items,
        decimal TotalShipmentWeightKg,
        int? DriverId,
        int? VanId,
        string Observations
    );

    public record UpdateShipmentDTO(
        TransferenceDirection Movement,
        DeliveryStatus Status,
        List<ShipmentItemDTO> Items,
        DateTime? DateOfDeliveryOrReturn,
        decimal TotalShipmentWeightKg,
        int? DriverId,
        int? VanId
    );

    public record ReturnedItemDTO(
        int Id,
        int ShipmentItemId,
        string BatchNumber,
        decimal QuantityReturned,
        string? RejectionReason,
        DateTime ReturnedAt
    );
    
    public record CreateReturnedItemDTO(
        int ShipmentItemId,
        string BatchNumber,
        decimal QuantityReturned,
        string? RejectionReason
    );

    public record CreateReturnDTO(
        List<CreateReturnedItemDTO> ReturnedItems,
        string Observations
    );
}
