using PDMS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;



namespace PDMS.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

            context.Database.EnsureCreated();

            // CORREÇÃO: RoleManager usa IdentityRole<int>, não Employee
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<Employee>>();

            await SeedIdentityAsync(userManager, roleManager);

            SeedCompanies(context);
            SeedVans(context);
            context.SaveChanges();
        }

        private static async Task SeedIdentityAsync(UserManager<Employee> userManager, RoleManager<IdentityRole<int>> roleManager)
        {

            await SeedRolesAsync(userManager, roleManager);

            var adminEmail = "admin@gdpa.pt";
            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var admin = new Employee
                {
                    UserName = adminEmail,
                    Initials = "AS",
                    Email = adminEmail,
                    EmailConfirmed = true,
                    Name = "Admin Sistema",
                    Department = "Administração",
                    taxId = "109999999",
                    PhoneNumber = "123456789",
                    DateOfAdmission = DateOnly.FromDateTime(DateTime.Now),
                    Status = EmployeeStatus.Active,
                };

                var result = await userManager.CreateAsync(admin, "SenhaSegura123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, JobTitle.Admin.ToString());
                }
            }
        }
        private static async Task SeedRolesAsync(UserManager<Employee> userManager, RoleManager<IdentityRole<int>> roleManager)
        {
            var roles = Enum.GetNames(typeof(JobTitle));
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(role));
                }
            }
        }
        private static void SeedCompanies(ApplicationDbContext context)
        {
            if (context.Companies.Any()) return;

            var companies = new Company[]
            {
            new Company
            {
                Name = "LusiAves, SA",
                taxId = "999888777",
                PhoneNumber = "210210210",
                Email = "contacto@lusiaves.pt",
                StreetAdress = "Rua Principal, 123",
                PostalCode = "2500-000",
                Location = "Caldas da Rainha",
                IndustryCode = "10120",
                ShareCapital = 500000.00m
            },
            new Company
            {
                Name = "Talho do Zé Lda",
                taxId = "111222333",
                PhoneNumber = "220220220",
                Email = "ze@talho.pt",
                StreetAdress = "Rua Secundária, 45",
                PostalCode = "4000-000",
                Location = "Porto",
                IndustryCode = "47220",
                ShareCapital = 50000.00m
            }

            };
            context.Companies.AddRange(companies);
            context.SaveChanges();

            if (context.HoldingCompanies.Any()) return;

            var lusiAves = context.Companies.FirstOrDefault(e => e.taxId == "999888777");

            if (lusiAves != null)
            {
                context.HoldingCompanies.Add(new HoldingCompany
                {
                    CompanyId = lusiAves.Id
                });
                context.SaveChanges();
            }
        }

        private static void SeedVans(ApplicationDbContext context)
        {
            if (context.Vans.Any()) return;

            var vans = new Van[]
            {
                new Van
                {
                    LicensePlate = "AA-11-BB",
                    DataOfInspection = new DateOnly(2024, 12, 15),
                    MaxLoadKg = 1200.0m,
                    MaxVolumeM3 = 8.5,
                    Status = VanStatus.Available
                },
                new Van
                {
                    LicensePlate = "CC-22-DD",
                    DataOfInspection = new DateOnly(2025, 05, 20),
                    MaxLoadKg = 3500.0m,
                    MaxVolumeM3 = 15.0,
                    Status = VanStatus.Loading
                },
                new Van
                {
                    LicensePlate = "EE-33-FF",
                    DataOfInspection = new DateOnly(2024, 08, 10),
                    MaxLoadKg = 850.0m,
                    MaxVolumeM3 = 5.2,
                    Status = VanStatus.BrokenOrMaintence
                },
                new Van
                {
                    LicensePlate = "GG-44-HH",
                    DataOfInspection = new DateOnly(2025, 01, 30),
                    MaxLoadKg = 2200.0m,
                    MaxVolumeM3 = 12.0,
                    Status = VanStatus.Loading
                },
                new Van
                {
                    LicensePlate = "II-55-JJ",
                    DataOfInspection = new DateOnly(2024, 11, 05),
                    MaxLoadKg = 1500.0m,
                    MaxVolumeM3 = 10.0,
                    Status = VanStatus.Available
                }
            };
            context.Vans.AddRange(vans);
            context.SaveChanges();
        }
    }
}
