using Microsoft.AspNetCore.Mvc;
using PDMS.DTO;
using PDMS.Services;


namespace PDMS.Endpoints
{
    public static class CompanyEndpoints
    {
        public static void RegisterCompanyEndpoints(this WebApplication app)
        {
            var company = app.MapGroup("/api/companies");

            company.MapGet("/", GetAllCompanies);
            company.MapGet("/{id}", GetCompanyById);
            company.MapPost("/", RegisterCompany);
            company.MapPut("/{id}", UpdateCompanyById);
            company.MapDelete("/{id}", DeleteCompany);
        }

        public static async Task<IResult> GetAllCompanies([FromServices] CompanyService companyService)
        {
            var companies = await companyService.GetAllCompanies();
            return Results.Ok(companies);
        }

        public static async Task<IResult> GetCompanyById([FromServices] CompanyService companyService, int id)
        {
            var company = await companyService.GetCompanyById(id);

            if (company is null)
            {
                return Results.NotFound($"Company with ID {id} was not found.");
            }

            return Results.Ok(new CompanyDTO(
                company.Name,
                company.TaxId,        
                company.StreetAdress,
                company.PostalCode,
                company.Location,
                company.Email,
                company.PhoneNumber
            ));
        }

        public static async Task<IResult> RegisterCompany(CompanyDTO request, [FromServices] CompanyService companyService)
        {
            var result = await companyService.CreateCompanyAsync(request);
            return Results.Ok(result);
        }

        public static async Task<IResult> UpdateCompanyById(int id, [FromBody] CompanyDTO request, [FromServices] CompanyService companyService)
        {
            var company = await companyService.GetCompanyById(id);

            if (company is null) return Results.NotFound();
            company.Name = request.Name;

            company.StreetAdress = request.StreetAdress;
            company.PostalCode = request.PostalCode;
            company.Location = request.Location;
            company.Email = request.Email;
            company.PhoneNumber = request.PhoneNumber;

            await companyService.UpdateCompanyAsync(company);
            return Results.Ok(company);
        }

        public static async Task<IResult> DeleteCompany(int id, [FromBody] CompanyDTO request, [FromServices] CompanyService companyService)
        {
            var success = await companyService.DeleteCompany(id);
            return success ? Results.Ok() : Results.NotFound();
        }

    }

}
