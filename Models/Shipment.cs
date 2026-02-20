using System.ComponentModel.DataAnnotations;

namespace test_Identity_from_Scratch.Models
{
    public class Shipment
    {
        public int Id { get; set; }

        [Required]
        public string RegisterNumber { get; set; } = string.Empty; // Único (configurar no DbContext)

        public DateTime RegisterData { get; set; } = DateTime.Now;

        [Range(typeof(decimal), "0.01", "5000.0")]
        public decimal WeightKg { get; set; }

        [Required]
        public TransferenceDirection Movement { get; set; }

        [Required]
        [StringLength(200)]
        public string Item { get; set; } = string.Empty;
        public DeliveryStatus status { get; set; } = DeliveryStatus.Registered;

        public DateTime? DateOfDeliveryOrReturn { get; set; }

        // Como sugeriste, uma string para notas livres
        public string Observations { get; set; } = string.Empty;
    }
}
