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
            company.MapGet("/{name}", GetCompanyById);
            company.MapPost("/", RegisterCompany);
            company.MapPut("/{name}", UpdateCompanyByName);
            company.MapDelete("/{name}", DeleteCompany);
        }

        public static async Task<IResult> GetAllCompanies([FromServices] CompanyService companyService)
        {
            var companies = await companyService.GetAllCompanies();
            return Results.Ok(companies);
        }

        public static async Task<IResult> GetCompanyById([FromServices] CompanyService companyService, int CompanyId)
        {
            var company = await companyService.GetCompanyById(CompanyId);

            if (company is null)
            {
                return Results.NotFound(new { message = $"Company with ID {CompanyId} was not found." });
            }

            return Results.Ok(company);
        }

        public static async Task<IResult> RegisterCompany(CompanyDTO request, [FromServices] CompanyService companyService)
        {
            var result = await companyService.CreateCompanyAsync(request);
            return Results.Ok(result);
        }

        public static async Task<IResult> UpdateCompanyByName(int CompanyId, [FromBody] CompanyDTO request, [FromServices] CompanyService companyService)
        {
            var response = await companyService.UpdateCompanyAsync(CompanyId, request);  

            if (response is null) return Results.NotFound(new { message = $"Company with ID {CompanyId} was not found." });

            return Results.Ok(response);
        }

        public static async Task<IResult> DeleteCompany(int CompanyId, [FromServices] CompanyService companyService)
        {
            var success = await companyService.DeleteCompany(CompanyId);
            return success ? Results.Ok() : Results.NotFound();
        }

    }

}
