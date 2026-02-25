using Microsoft.AspNetCore.Identity; // Adicionar este namespace
using PDMS.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PDMS.Models
{
    // Herdando de IdentityUser<int> para usar IDs inteiros
    public class Employee : IdentityUser<int>
    {
        // O Id e o Email já são fornecidos pela classe base (IdentityUser)

        [Required(ErrorMessage = "The field name is mandatory.")]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public bool EnableNotifications { get; set; }

        public string Initials { get; set; } = string.Empty;

        [Required]
        public string Department { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^\d{9}$", ErrorMessage = "taxId must have exactly 9 dígits.")]
        public string TaxId { get; set; } = string.Empty;

        public DateOnly DateOfAdmission { get; set; }


        [JsonConverter(typeof(JsonStringEnumConverter))]
        public EmployeeStatus Status { get; set; } = EmployeeStatus.Active;
    }
}

