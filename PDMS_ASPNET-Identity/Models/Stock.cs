using System.ComponentModel.DataAnnotations;

namespace PDMS.Models
{
    public class Stock
    {

        public int Id { get; set; }

        [Required]
        public string BatchNumber { get; set; } = string.Empty;

        public ProductType Product { get; set; }

        [Range(typeof(decimal), "0.01", "9999.99")]
        public decimal Quantity { get; set; }

        public string Source { get; set; } = string.Empty;

        public DateOnly? SlaughterDate { get; set; }

        public DateOnly? ProcessingDate { get; set; }

        public DateOnly ExpiryDate { get; set; }
    }
}
