using Microsoft.EntityFrameworkCore;
using PDMS.Data;
using PDMS.Models;
using PDMS.DTO;

namespace PDMS.Services
{
    public class CompanyService
    {
        private readonly ApplicationDbContext _context;

        public CompanyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CompanyDTO>> GetAllCompanies()
        {
            var companies = await _context.Companies.ToListAsync();

            return companies.Select(c => new CompanyDTO(c)).ToList();
        }

        public async Task<CompanyDTO?> GetCompanyByName(string name)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Name == name); ;
            if (company == null) return null; 

            return new CompanyDTO(company);            
        }

        public async Task<CompanyDTO> CreateCompanyAsync(CompanyDTO request)
        {
            Company company = request.ToEntity();

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();


            return new CompanyDTO(company);
        }

        public async Task<CompanyDTO?> UpdateCompanyAsync(string name, CompanyDTO request)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Name == name); ;
            if (company == null) return null;

            company.BusinessGroupId = request.BusinessGroupId;
            company.StreetAdress = request.StreetAdress;
            company.PostalCode = request.PostalCode;
            company.Location = request.Location;
            company.Email = request.Email;
            company.PhoneNumber = request.PhoneNumber;
            await _context.SaveChangesAsync();

            return new CompanyDTO(company);
        }

        public async Task<bool> DeleteCompany(string name)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Name == name);
            if (company == null) return false;
            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();
            return true;

        }
    }
}
