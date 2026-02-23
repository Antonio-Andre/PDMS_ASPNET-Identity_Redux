
namespace PDMS.Models
{
    public class HoldingCompany
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company? Company { get; set; }   // virtual para lazy loading
    }
}
