namespace PDMS.Models
{
    public class ReturnedItem
    {
        public int Id { get; set; }
        public string BatchNumber { get; set; } = string.Empty;
        public decimal QuantityReturned { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime ReturnedAt { get; set; }
        public int ShipmentId { get; set; }
    }
}
