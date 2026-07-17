
namespace test_Identity_from_Scratch.Models
{
    public class HoldingCompany
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company? Company { get; set; }   // virtual para lazy loading
    }
}
