using Microsoft.EntityFrameworkCore;
using PDMS.Data;
using PDMS.DTO;
using PDMS.Models;
using PDMS.Services;

namespace PDMS.Tests;

public class CompanyServiceTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    private CompanyDTO CreateSampleDTO(
        int id = 0,
        string name = "Empresa Teste",
        string email = "teste@empresa.com",
        string location = "Lisboa")
    {
        return new CompanyDTO(
            id,
            name,
            "123456789",
            null,
            "Rua Exemplo",
            "1000-001",
            location,
            email,
            "912345678"
        );
    }

    [Fact]
    public async Task GetAllCompanies_WhenCompaniesExist_ReturnsListOfCompanyDTOs()
    {
        using var context = GetInMemoryDbContext();
        context.Companies.AddRange(
            new Company { Id = 1, Name = "Empresa A", Email = "a@test.com" },
            new Company { Id = 2, Name = "Empresa B", Email = "b@test.com" }
        );
        await context.SaveChangesAsync(TestContext.Current.CancellationToken);

        var service = new CompanyService(context);

        var result = await service.GetAllCompanies();

        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.Contains(result, c => c.Name == "Empresa A");
        Assert.Contains(result, c => c.Name == "Empresa B");
    }

    [Fact]
    public async Task GetAllCompanies_WhenNoCompaniesExist_ReturnsEmptyList()
    {
        using var context = GetInMemoryDbContext();
        var service = new CompanyService(context);

        var result = await service.GetAllCompanies();

        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetCompanyById_WhenCompanyExists_ReturnsCompanyDTO()
    {
        using var context = GetInMemoryDbContext();
        context.Companies.Add(new Company { Id = 1, Name = "Empresa Alfa", Email = "alfa@test.com" });
        await context.SaveChangesAsync(TestContext.Current.CancellationToken);

        var service = new CompanyService(context);

        var result = await service.GetCompanyById(1);

        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("Empresa Alfa", result.Name);
    }

    [Fact]
    public async Task GetCompanyById_WhenCompanyDoesNotExist_ReturnsNull()
    {
        using var context = GetInMemoryDbContext();
        var service = new CompanyService(context);

        var result = await service.GetCompanyById(99);

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateCompanyAsync_ValidRequest_PersistsAndReturnsCompanyDTO()
    {
        using var context = GetInMemoryDbContext();
        var service = new CompanyService(context);

        var requestDto = CreateSampleDTO(0, "Nova Empresa", "nova@empresa.com", "Lisboa");

        var result = await service.CreateCompanyAsync(requestDto);

        Assert.NotNull(result);
        Assert.Equal("Nova Empresa", result.Name);

        var companyInDb = await context.Companies.FirstOrDefaultAsync(
            c => c.Email == "nova@empresa.com",
            TestContext.Current.CancellationToken
        );
        Assert.NotNull(companyInDb);
        Assert.Equal("Lisboa", companyInDb.Location);
    }

    [Fact]
    public async Task UpdateCompanyAsync_WhenCompanyExists_UpdatesFieldsAndReturnsDTO()
    {
        using var context = GetInMemoryDbContext();
        var originalCompany = new Company
        {
            Id = 1,
            Name = "Nome Antigo",
            Location = "Porto",
            Email = "antigo@test.com",
            PhoneNumber = "111111111"
        };
        context.Companies.Add(originalCompany);
        await context.SaveChangesAsync(TestContext.Current.CancellationToken);

        var service = new CompanyService(context);

        var updateRequest = CreateSampleDTO(1, "Nome Antigo", "novo@test.com", "Lisboa");

        var result = await service.UpdateCompanyAsync(1, updateRequest);

        Assert.NotNull(result);
        Assert.Equal("Lisboa", result.Location);
        Assert.Equal("novo@test.com", result.Email);

        var companyInDb = await context.Companies.FindAsync(
            [1],
            cancellationToken: TestContext.Current.CancellationToken
        );
        Assert.NotNull(companyInDb);
        Assert.Equal("Lisboa", companyInDb.Location);
    }

    [Fact]
    public async Task UpdateCompanyAsync_WhenCompanyDoesNotExist_ReturnsNull()
    {
        using var context = GetInMemoryDbContext();
        var service = new CompanyService(context);
        var updateRequest = CreateSampleDTO();

        var result = await service.UpdateCompanyAsync(99, updateRequest);

        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteCompany_WhenCompanyExists_RemovesFromDbAndReturnsTrue()
    {
        using var context = GetInMemoryDbContext();
        context.Companies.Add(new Company { Id = 1, Name = "Empresa Para Eliminar" });
        await context.SaveChangesAsync(TestContext.Current.CancellationToken);

        var service = new CompanyService(context);

        var result = await service.DeleteCompany(1);

        Assert.True(result);

        var companyInDb = await context.Companies.FindAsync(
            [1],
            cancellationToken: TestContext.Current.CancellationToken
        );
        Assert.Null(companyInDb);
    }

    [Fact]
    public async Task DeleteCompany_WhenCompanyDoesNotExist_ReturnsFalse()
    {
        using var context = GetInMemoryDbContext();
        var service = new CompanyService(context);

        var result = await service.DeleteCompany(99);

        Assert.False(result);
    }
}