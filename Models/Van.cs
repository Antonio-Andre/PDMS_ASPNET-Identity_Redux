using System.ComponentModel.DataAnnotations;

namespace PDMS.Models
{
    public class Van
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "A matrícula é obrigatória.")]
        [RegularExpression(@"^[A-Z]{2}-[0-9]{2}-[A-Z]{2}$", ErrorMessage = "Formato de matrícula inválido.")]
        public string LicensePlate { get; set; } = string.Empty; // Única na DB (configurar no DbContext)

        [Required(ErrorMessage = "A data da inspeção é obrigatória.")]
        public DateOnly DataOfInspection { get; set; }

        // Usando decimal para precisão no peso
        [Range(typeof(decimal), "100.0", "350.0", ErrorMessage = "A carga máxima deve ser entre 1kg e 30000kg.")]
        public decimal MaxLoadKg { get; set; }

        // Volume pode usar double se não for crítico para finanças
        [Range(0.1, 200.0, ErrorMessage = "O volume deve ser entre 0.1m³ e 200m³.")]
        public double MaxVolumeM3 { get; set; }

        public VanStatus Status { get; set; } = VanStatus.Available;
    }

}
