using System.ComponentModel.DataAnnotations;

namespace PDMS.Models
{
    public class Shipment
    {
        public int Id { get; set; }
        public string RegisterNumber { get; set; } = string.Empty;
        [Required]
        public TransferenceDirection Movement { get; set; }
        public DeliveryStatus Status { get; set; } = DeliveryStatus.Registered;

        [Required]
        public List<ShipmentItem> Items { get; set; } = new List<ShipmentItem>();

        public List<ReturnedItem> ReturnedItems { get; set; } = new();

        [Range(typeof(decimal),"0.01", "1000.0")]
        public decimal TotalShipmentWeightKg { get; set; }

        [Required]
        public DateTime RegisterData { get; set; } = DateTime.Now;

        public DateTime SLAExpiration { get; set; } = DateTime.Now.AddHours(72); //SLAExpiration = Deadline
        public DateTime? DateOfDeliveryOrReturn { get; set; }
        public int? DriverId { get; set; } 
        public int? VanId { get; set; }        
        public string Observations { get; set; } = string.Empty;

        public decimal? DeliveryLatitude;
        public decimal? DeliveryLongitude;
        public string? DestinationAddress;

    }
}
