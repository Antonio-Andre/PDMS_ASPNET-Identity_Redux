using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PDMS.Models
{
    public class ShipmentItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int ShipmentId { get; set; }

        [ForeignKey("ShipmentId")]
        public Shipment? Shipment { get; set; }
        public string BatchNumber { get; set; } = string.Empty;

        [Required]
        public ProductType Product { get; set; }
        public int Quantity { get; set; }

        public decimal QuantityDelivered { get; set; }

        public DeliveryStatus Status { get; set; }

        [Range(typeof(decimal), "0.01", "10.0")]
        public decimal? ItemWeightKg { get; set; }
    }
}