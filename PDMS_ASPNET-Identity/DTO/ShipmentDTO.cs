using PDMS.Models;

namespace PDMS.DTO
{
    public record ShipmentItemDTO(
        int Id,
        string BatchNumber,
        ProductType Product,
        int Quantity,
        int ShipmentId,
        decimal? ItemWeightKg
    )
    {
        public static ShipmentItemDTO FromEntity(ShipmentItem item) =>
            new(
                item.Id,
                item.BatchNumber,
                item.Product,
                item.Quantity,
                item.ShipmentId,
                item.ItemWeightKg
            );
    }

    public record ReturnedItemDTO(
        int Id,
        int ShipmentItemId,
        string BatchNumber,
        decimal QuantityReturned,
        string? RejectionReason,
        DateTime ReturnedAt
    )
    {
        public static ReturnedItemDTO FromEntity(ReturnedItem item) =>
            new(
                item.Id,
                item.ShipmentItemId,
                item.BatchNumber,
                item.QuantityReturned,
                item.RejectionReason,
                item.ReturnedAt
            );
    }

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
    )
    {
        public static ResponseShipmentDTO FromEntity(Shipment shipment) =>
            new(
                shipment.Id,
                shipment.RegisterNumber,
                shipment.Movement,
                shipment.Status,
                shipment.Items?.Select(ShipmentItemDTO.FromEntity).ToList() ?? new List<ShipmentItemDTO>(),
                shipment.ReturnedItems?.Select(ReturnedItemDTO.FromEntity).ToList() ?? new List<ReturnedItemDTO>(),
                shipment.RegisterDate,
                shipment.SLAExpiration,
                shipment.DateOfDeliveryOrReturn,
                shipment.TotalShipmentWeightKg,
                shipment.DriverId,
                shipment.VanId,
                shipment.Observations ?? string.Empty
            );
    }

    public record CreateShipmentDTO(
        string RegisterNumber,
        TransferenceDirection Movement,
        DeliveryStatus Status,
        List<ShipmentItemDTO> Items,
        decimal TotalShipmentWeightKg,
        int? DriverId,
        int? VanId,
        string? Observations
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

    public record CreateReturnedItemDTO(
        int ShipmentItemId,
        string BatchNumber,
        decimal QuantityReturned,
        string? RejectionReason
    );

    public record CreateReturnDTO(
        List<CreateReturnedItemDTO> ReturnedItems,
        string? Observations
    );
}