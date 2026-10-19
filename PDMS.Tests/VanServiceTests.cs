using Microsoft.EntityFrameworkCore;
using PDMS.Data;
using PDMS.DTO;
using PDMS.Models;
using PDMS.Services;

namespace PDMS.Tests;

public class VanServiceTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetAllVansAsync_WhenVansExist_ReturnsListOfVans(){ 
        //AAA
        //1. ARRANGE
        using var context = GetInMemoryDbContext();
        context.Vans.AddRange(
            new Van { Id = 1, LicensePlate = "ABC123", MaxLoadKg = 1000 },
            new Van { Id = 2, LicensePlate = "XYZ789", MaxLoadKg = 1500 }
        );
        //persist inMemory()
        await context.SaveChangesAsync(TestContext.Current.CancellationToken);

        //2. ACT
        var service = new VanService(context);
        var result = await service.GetAllVansAsync();

        //3. ASSERT
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.Equal("ABC123", result[0].LicensePlate);
    }
}