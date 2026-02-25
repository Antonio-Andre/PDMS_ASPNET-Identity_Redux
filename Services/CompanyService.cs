using Microsoft.EntityFrameworkCore;
using PDMS.Data;
using PDMS.Models;
using PDMS.DTO;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace PDMS.Services
{
    public class CompanyService
    {
        private readonly ApplicationDbContext _context;

        public CompanyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Company>> GetAllCompanies()
        {
            return await _context.Companies.ToListAsync();
        }

        public async Task<Company?> GetCompanyById(int id)
        {
            return await _context.Companies.FindAsync(id);
        }

        public async Task<Company> CreateCompanyAsync(CompanyDTO request)
        {
            Company company = new Company
            {
                Name = request.Name,
                TaxId = request.TaxId,
                StreetAdress = request.StreetAdress,
                PostalCode = request.PostalCode,
                Location = request.Location,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                IndustryCode = "PENDING",
                ShareCapital = null,
            };

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();
            return company;
        }

        public async Task<bool> UpdateCompanyAsync(Company company)
        {
            _context.Companies.Update(company);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCompany(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null) return false;
            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();
            return true;

        }
    }
}
