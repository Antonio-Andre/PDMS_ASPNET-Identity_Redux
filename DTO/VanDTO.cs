using PDMS.Models;
using System.ComponentModel.DataAnnotations;

namespace PDMS.DTO
{
    public record VanResponseDTO(
        int Id,
        string LicensePlate,
        DateOnly DataOfInspection,
        decimal MaxLoadKg,
        double MaxVolumeM3,
        string Status
    );

    public record CreateVanDTO(
        [Required][RegularExpression(@"^[A-Z]{2}-[0-9]{2}-[A-Z]{2}$")] string LicensePlate,
        [Required] DateOnly DataOfInspection,
        [Range(100.0, 350.0)] decimal MaxLoadKg,
        [Range(0.1, 200.0)] double MaxVolumeM3
    );

    public record UpdateVanDTO(
        DateOnly DataOfInspection,
        decimal MaxLoadKg,
        double MaxVolumeM3,
        VanStatus Status
    );
}