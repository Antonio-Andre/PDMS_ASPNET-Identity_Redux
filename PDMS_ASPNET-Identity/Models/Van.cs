using System.ComponentModel.DataAnnotations;

namespace PDMS.Models
{
    public class Van
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "License plate is required.")]
        [RegularExpression(@"^[A-Z]{2}-[0-9]{2}-[A-Z]{2}$", ErrorMessage = "Invalid license plate format.")]
        public string LicensePlate { get; set; } = string.Empty;

        [Required(ErrorMessage = "Inspection date is required.")]
        public DateOnly InspectionDate { get; set; }

        [Range(typeof(decimal), "100.0", "350.0", ErrorMessage = "Max load must be between 100kg and 350kg.")]
        public decimal MaxLoadKg { get; set; }

        public decimal? CurrentLoadKg { get; set; }

        public VanStatus Status { get; set; } = VanStatus.Available;
    }
}