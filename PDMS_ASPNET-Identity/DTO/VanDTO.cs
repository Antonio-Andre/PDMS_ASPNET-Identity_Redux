using PDMS.Models;
using System.ComponentModel.DataAnnotations;

namespace PDMS.DTO
{
    public record VanResponseDTO(
        int Id,
        string LicensePlate,
        DateOnly DataOfInspection,
        decimal MaxLoadKg,
        string Status
    );

    public record CreateVanDTO(
        [Required]
        [RegularExpression(@"^[A-Z]{2}-[0-9]{2}-[A-Z]{2}$")]
        string LicensePlate,

        [Required] 
        DateOnly DataOfInspection,

        [Required]
        [Range(100.0, 350.0, ErrorMessage = "A carga máxima deve estar entre 100kg e 350kg.")] 
        decimal MaxLoadKg
    );

    public record UpdateVanDTO(
        DateOnly DataOfInspection,
        VanStatus Status
    );
}