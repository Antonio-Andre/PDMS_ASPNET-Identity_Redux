using System.ComponentModel.DataAnnotations;

namespace test_Identity_from_Scratch.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        [RegularExpression(@"^\d{9}$", ErrorMessage = "taxId inválido.")]
        public string taxId { get; set; } = string.Empty;

        public string StreetAdress { get; set; } = string.Empty;

        [RegularExpression(@"^\d{4}-\d{3}$")]
        public string PostalCode { get; set; } = string.Empty; // Formato 0000-000
        public string Location { get; set; } = string.Empty;

        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string IndustryCode { get; set; } = string.Empty;

        [Range(typeof(decimal), "0.00", "999999999.99")]
        public decimal ShareCapital { get; set; }
    }

}
