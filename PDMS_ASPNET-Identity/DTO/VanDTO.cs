using System.ComponentModel.DataAnnotations;
using PDMS.Models;

namespace PDMS.DTO
{
    public record VanResponseDTO(
        int Id,
        string LicensePlate,
        DateOnly InspectionDate,
        decimal MaxLoadKg,
        decimal? CurrentLoadKg,
        string Status
    );

    public record CreateVanDTO(
        [Required(ErrorMessage = "License plate is required.")]
        [RegularExpression(@"^[A-Z]{2}-[0-9]{2}-[A-Z]{2}$", ErrorMessage = "Invalid license plate format.")]
        string LicensePlate,

        [Required(ErrorMessage = "Inspection date is required.")]
        DateOnly InspectionDate,

        [Required(ErrorMessage = "Max load is required.")]
        [Range(100.0, 350.0, ErrorMessage = "Max load must be between 100kg and 350kg.")]
        decimal MaxLoadKg,

        decimal? CurrentLoadKg = null
    );

    public record UpdateVanDTO(
        DateOnly InspectionDate,
        VanStatus Status,
        decimal? CurrentLoadKg
    );
}