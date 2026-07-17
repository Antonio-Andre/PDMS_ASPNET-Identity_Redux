using System.ComponentModel.DataAnnotations;

namespace PDMS.Models
{
    public class ShipmentItem
    {
        public int Id { get; set; }
        public string BatchNumber { get; set; } = string.Empty;

        [Required]
        public ProductType Product { get; set; }
        public int Quantity { get; set; }

        public decimal QuantityDelivered { get; set; }

        public DeliveryStatus Status { get; set; }
        public int ShipmentId { get; set; }

        [Range(typeof(decimal), "0.01", "10.0")]
        public decimal? ItemWeightKg { get; set; }
    }
}