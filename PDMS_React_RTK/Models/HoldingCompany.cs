using PDMS.Models;
using System.ComponentModel.DataAnnotations;

public class BusinessGroup
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string TaxId { get; set; } = string.Empty;
    public virtual ICollection<Company> Companies { get; set; } = new List<Company>();
}