using System.ComponentModel.DataAnnotations;

namespace PDMS.Models
{
    public class Stock
    {

        public int Id { get; set; }

        [Required]
        public string BatchNumber { get; set; } = string.Empty;

        public ProductType Product { get; set; }

        [Range(typeof(decimal), "0.01", "10.0")]
        public decimal Quantity { get; set; }

        public string Source { get; set; } = string.Empty;

        public DateOnly? SlaughterDate { get; set; }

        public DateOnly? ProcessingDate { get; set; }

        public DateOnly ExpiryDate { get; set; }
    }
}
