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

            
            await context.Database.MigrateAsync();

            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<Employee>>();

            await SeedIdentityAsync(userManager, roleManager);

            await SeedCompaniesAsync(context);
            await SeedVansAsync(context);
            await SeedStockAsync(context);
            await SeedShipmentsAsync(context, userManager);
            await context.SaveChangesAsync();
        }

        private static async Task SeedIdentityAsync(UserManager<Employee> userManager, RoleManager<IdentityRole<int>> roleManager)
        {

            await SeedRolesAsync(userManager, roleManager);

            var defaultUsers = new List<(string Email, string Name, string Initials, string Department, string TaxId, string Phone, JobTitle Role)>
            {
                ("quim@gdpa.pt",     "Joaquim Ferreria",       "JF", "Administration", "109999999", "123456789", JobTitle.Admin),
                ("gabi@gdpa.pt",      "Gabriela Couto",      "GC", "Logistics",     "201111111", "910000001", JobTitle.DockManager),
                ("guida@gdpa.pt",    "Margarida Esteves",  "ME", "Distribuition",  "202222222", "910000002", JobTitle.DeliveryDriver),
                ("gui@gdpa.pt", "Guilherme Matos",   "GM", "Warehouse",       "203333333", "910000003", JobTitle.InventoryManager),
                ("olga@gdpa.pt",  "Olga Almeida",    "OA", "Operations",     "204444444", "910000004", JobTitle.Operator)
            };

            foreach (var u in defaultUsers)
            {
                if (await userManager.FindByEmailAsync(u.Email) == null)
                {
                    var employee = new Employee
                    {
                        UserName = u.Email,
                        Initials = u.Initials,
                        Email = u.Email,
                        EmailConfirmed = true,
                        Name = u.Name,
                        Department = u.Department,
                        TaxId = u.TaxId,
                        PhoneNumber = u.Phone,
                        AdmissionDate = DateOnly.FromDateTime(DateTime.UtcNow),
                        Status = EmployeeStatus.Active,
                    };

                    var result = await userManager.CreateAsync(employee, "SenhaSegura123!");
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(employee, u.Role.ToString());
                    }
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
        private static async Task SeedCompaniesAsync(ApplicationDbContext context)
        {
            if (await context.Companies.AnyAsync()) return;

            var grupoLusi = new BusinessGroup
            {
                Name = "Grupo LusiAves",
                TaxId = "500111222" 
            };

            context.BusinessGroups.Add(grupoLusi);
            await context.SaveChangesAsync();

            var companies = new Company[]
            {
                new Company
                {
                    BusinessGroupId = grupoLusi.Id,
                    Name = "LusiAves, SA",
                    TaxId = "999888777",
                    PhoneNumber = "210210210",
                    Email = "contacto@lusiaves.pt",
                    StreetAdress = "Rua Principal, 23",
                    PostalCode = "2500-000",
                    Location = "Caldas da Rainha",
                    IndustryCode = "10120",
                    ShareCapital = 500000.00m
                },
                new Company
                {
                    Name = "Talho do Zé Lda",
                    TaxId = "111222333",
                    PhoneNumber = "220220220",
                    Email = "ze@talho.pt",
                    StreetAdress = "Rua Secundária, 45",
                    PostalCode = "4000-000",
                    Location = "Porto",
                    IndustryCode = "47220",
                    ShareCapital = 50000.00m
                },
                new Company
                {
                    Name = "FreshMeat Logistics Ltd",
                    TaxId = "501234567",
                    PhoneNumber = "213456789",
                    Email = "operations@freshmeatlogistics.com",
                    StreetAdress = "Industrial Park North, Plot 14",
                    PostalCode = "2600-001",
                    Location = "Vila Franca de Xira",
                    IndustryCode = "49410",
                    ShareCapital = 250000.00m
                },
                new Company
                {
                    Name = "Atlantic Cold Chain Corp",
                    TaxId = "509876543",
                    PhoneNumber = "244987654",
                    Email = "dispatch@atlanticcoldchain.com",
                    StreetAdress = "Harbor Logistics Avenue, 88",
                    PostalCode = "2400-002",
                    Location = "Leiria",
                    IndustryCode = "52101",
                    ShareCapital = 750000.00m
                }
            };

            context.Companies.AddRange(companies);
            context.SaveChanges();
        }

        private static async Task SeedVansAsync(ApplicationDbContext context)
        {
            if (await context.Vans.AnyAsync()) return;

            var vans = new Van[]
            {
                new Van
                {
                    LicensePlate = "AA-11-BB",
                    InspectionDate = new DateOnly(2024, 12, 15),
                    MaxLoadKg = 1200.0m,
                    Status = VanStatus.Available
                },
                new Van
                {
                    LicensePlate = "CC-22-DD",
                    InspectionDate = new DateOnly(2025, 05, 20),
                    MaxLoadKg = 3500.0m,
                    Status = VanStatus.Loading
                },
                new Van
                {
                    LicensePlate = "EE-33-FF",
                    InspectionDate = new DateOnly(2024, 08, 10),
                    MaxLoadKg = 850.0m,
                    Status = VanStatus.BrokenOrMaintenance
                },
                new Van
                {
                    LicensePlate = "GG-44-HH",
                    InspectionDate = new DateOnly(2025, 01, 30),
                    MaxLoadKg = 2200.0m,
                    Status = VanStatus.Loading
                },
                new Van
                {
                    LicensePlate = "II-55-JJ",
                    InspectionDate = new DateOnly(2024, 11, 05),
                    MaxLoadKg = 1500.0m,
                    Status = VanStatus.Available
                }
            };
            context.Vans.AddRange(vans);
            await context.SaveChangesAsync();
        }
        private static async Task SeedShipmentsAsync(ApplicationDbContext context, UserManager<Employee> userManager)
        {
            if (await context.Shipments.AnyAsync()) return;

            var driver = await userManager.FindByEmailAsync("driver@gdpa.pt");
            var firstVan = await context.Vans.FirstOrDefaultAsync();

            int? driverId = driver?.Id;
            int? vanId = firstVan?.Id;
            var now = DateTime.UtcNow;

            var shipments = new List<Shipment>
            {
                new Shipment
                {
                    RegisterNumber = "SHP-2026-0001",
                    Movement = TransferenceDirection.Inbound,
                    Status = DeliveryStatus.Delivered,
                    TotalShipmentWeightKg = 138.00m,
                    RegisterDate = now.AddDays(-5),
                    SLAExpiration = now.AddDays(-2),
                    DateOfDeliveryOrReturn = now.AddDays(-3),
                    DriverId = driverId,
                    VanId = vanId,
                    Observations = "Delivered on schedule at main loading dock.",
                    Items = new List<ShipmentItem>
                    {
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-A01",
                            Product = ProductType.ChickenMeat_Box_5kg, // 5kg x 20 = 100kg
                            Quantity = 20,
                            QuantityDelivered = 20m,
                            Status = DeliveryStatus.Delivered,
                            ItemWeightKg = 100.00m
                        },
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-A01-B",
                            Product = ProductType.RoastedChicken_Unit, // 2kg x 10 = 20kg
                            Quantity = 10,
                            QuantityDelivered = 10m,
                            Status = DeliveryStatus.Delivered,
                            ItemWeightKg = 20.00m
                        },
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-A01-C",
                            Product = ProductType.ChickenStock_750ml_P4, // 3kg x 6 = 18kg
                            Quantity = 6,
                            QuantityDelivered = 6m,
                            Status = DeliveryStatus.Delivered,
                            ItemWeightKg = 18.00m
                        }
                    }
                },
                new Shipment
                {
                    RegisterNumber = "SHP-2026-0002",
                    Movement = TransferenceDirection.Inbound,
                    Status = DeliveryStatus.Delivered,
                    TotalShipmentWeightKg = 100.00m,
                    RegisterDate = now.AddDays(-4),
                    SLAExpiration = now.AddDays(-1),
                    DateOfDeliveryOrReturn = now.AddDays(-2),
                    DriverId = driverId,
                    VanId = vanId,
                    Observations = "Signed by warehouse supervisor.",
                    Items = new List<ShipmentItem>
                    {
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-A02",
                            Product = ProductType.TurkeyMeat_Box_10kg, // 10kg x 10 = 100kg
                            Quantity = 10,
                            QuantityDelivered = 10m,
                            Status = DeliveryStatus.Delivered,
                            ItemWeightKg = 100.00m
                        }
                    }
                },
                new Shipment
                {
                    RegisterNumber = "SHP-2026-0003",
                    Movement = TransferenceDirection.Inbound,
                    Status = DeliveryStatus.Delivered,
                    TotalShipmentWeightKg = 123.00m,
                    RegisterDate = now.AddDays(-3),
                    SLAExpiration = now,
                    DateOfDeliveryOrReturn = now.AddDays(-1),
                    DriverId = driverId,
                    VanId = vanId,
                    Observations = "Supplier restock received and checked.",
                    Items = new List<ShipmentItem>
                    {
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-B01",
                            Product = ProductType.ChickenMeat_Box_5kg, // 5kg x 15 = 75kg
                            Quantity = 15,
                            QuantityDelivered = 15m,
                            Status = DeliveryStatus.Delivered,
                            ItemWeightKg = 75.00m
                        },
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-B01-B",
                            Product = ProductType.DuckMeat_Box_5kg, // 5kg x 8 = 40kg (ou 6kg x 8 = 48kg)
                            Quantity = 8,
                            QuantityDelivered = 8m,
                            Status = DeliveryStatus.Delivered,
                            ItemWeightKg = 40.00m
                        },
                    }
                },
                new Shipment
                {
                    RegisterNumber = "SHP-2026-0004",
                    Movement = TransferenceDirection.Inbound,
                    Status = DeliveryStatus.InTransit,
                    TotalShipmentWeightKg = 125.00m,
                    RegisterDate = now.AddHours(-18),
                    SLAExpiration = now.AddHours(54),
                    DriverId = driverId,
                    VanId = vanId,
                    Observations = "En route to Porto distribution hub.",
                    Items = new List<ShipmentItem>
                    {
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-C01",
                            Product = ProductType.DuckMeat_Box_5kg, // 5kg x 25 = 125kg
                            Quantity = 25,
                            QuantityDelivered = 0m,
                            Status = DeliveryStatus.InTransit,
                            ItemWeightKg = 125.00m
                        }
                    }
                },
                new Shipment
                {
                    RegisterNumber = "SHP-2026-0005",
                    Movement = TransferenceDirection.Inbound,
                    Status = DeliveryStatus.Loaded,
                    TotalShipmentWeightKg = 120.00m,
                    RegisterDate = now.AddHours(-10),
                    SLAExpiration = now.AddHours(62),
                    DriverId = driverId,
                    VanId = vanId,
                    Observations = "Loaded in refrigerated van, ready for inbound dock.",
                    Items = new List<ShipmentItem>
                    {
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-C02",
                            Product = ProductType.TurkeyMeat_Box_10kg, // 10kg x 12 = 120kg
                            Quantity = 12,
                            QuantityDelivered = 0m,
                            Status = DeliveryStatus.Loaded,
                            ItemWeightKg = 120.00m
                        }
                    }
                },
                new Shipment
                {
                    RegisterNumber = "SHP-2026-0006",
                    Movement = TransferenceDirection.Inbound,
                    Status = DeliveryStatus.Registered,
                    TotalShipmentWeightKg = 286.00m,
                    RegisterDate = now.AddHours(-4),
                    SLAExpiration = now.AddHours(68),
                    Observations = "Awaiting van assignment at dock 2.",
                    Items = new List<ShipmentItem>
                    {
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-D01",
                            Product = ProductType.ChickenMeat_Box_5kg, // 5kg x 30 = 150kg
                            Quantity = 30,
                            QuantityDelivered = 0m,
                            Status = DeliveryStatus.Registered,
                            ItemWeightKg = 150.00m
                        },
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-D01-B",
                            Product = ProductType.RoastedChicken_Unit, // 2kg x 18 = 36kg
                            Quantity = 18,
                            QuantityDelivered = 0m,
                            Status = DeliveryStatus.Registered,
                            ItemWeightKg = 36.00m
                        }
                    }
                },
                new Shipment
                {
                    RegisterNumber = "SHP-2026-0007",
                    Movement = TransferenceDirection.Inbound,
                    Status = DeliveryStatus.Registered,
                    TotalShipmentWeightKg = 80.00m,
                    RegisterDate = now.AddHours(-2),
                    SLAExpiration = now.AddHours(70),
                    Observations = "Scheduled arrival from Atlantic Cold Chain Corp.",
                    Items = new List<ShipmentItem>
                    {
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-D02",
                            Product = ProductType.ChickenMeat_Box_5kg, // 5kg x 16 = 80kg
                            Quantity = 16,
                            QuantityDelivered = 0m,
                            Status = DeliveryStatus.Registered,
                            ItemWeightKg = 80.00m
                        }
                    }
                },
                new Shipment
                {
                    RegisterNumber = "SHP-2026-0008",
                    Movement = TransferenceDirection.Inbound,
                    Status = DeliveryStatus.Registered,
                    TotalShipmentWeightKg = 12.00m,
                    RegisterDate = now.AddMinutes(-45),
                    SLAExpiration = now.AddHours(71),
                    Observations = "Express local inbound order.",
                    Items = new List<ShipmentItem>
                    {
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-E01",
                            Product = ProductType.RoastedChicken_Unit, // 2kg x 6 = 12kg
                            Quantity = 6,
                            QuantityDelivered = 0m,
                            Status = DeliveryStatus.Registered,
                            ItemWeightKg = 12.00m
                        }
                    }
                },
                new Shipment
                {
                    RegisterNumber = "SHP-2026-0009",
                    Movement = TransferenceDirection.Outbound,
                    Status = DeliveryStatus.Loaded,
                    TotalShipmentWeightKg = 8.00m,
                    RegisterDate = now.AddDays(-2),
                    SLAExpiration = now.AddDays(1),
                    DateOfDeliveryOrReturn = now.AddHours(-6),
                    DriverId = driverId,
                    VanId = vanId,
                    Observations = "Outbound processed poultry order loaded.",
                    Items = new List<ShipmentItem>
                    {
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-C02",
                            Product = ProductType.PoultryBreast_Sliced_1kg, // 1kg x 8 = 8kg
                            Quantity = 8,
                            QuantityDelivered = 0m,
                            Status = DeliveryStatus.Loaded,
                            ItemWeightKg = 8.00m
                        }
                    }
                },
                new Shipment
                {
                    RegisterNumber = "SHP-2026-0010",
                    Movement = TransferenceDirection.Outbound,
                    Status = DeliveryStatus.Registered,
                    TotalShipmentWeightKg = 56.00m,
                    RegisterDate = now.AddDays(-1),
                    SLAExpiration = now.AddDays(2),
                    Observations = "Scheduled outbound dispatch of processed duck rice.",
                    Items = new List<ShipmentItem>
                    {
                        new ShipmentItem
                        {
                            BatchNumber = "LOT-2026-D02",
                            Product = ProductType.DuckRice_Indiv_P10, // 2kg x 28 = 56kg
                            Quantity = 28,
                            QuantityDelivered = 0m,
                            Status = DeliveryStatus.Registered,
                            ItemWeightKg = 56.00m
                        }
                    }
                }
            };
            await context.Shipments.AddRangeAsync(shipments);
            await context.SaveChangesAsync();
        }
        private static async Task SeedStockAsync(ApplicationDbContext context)
{
    if (await context.Stock.AnyAsync())
    {
        return;
    }

    var today = DateOnly.FromDateTime(DateTime.UtcNow);

    var stocks = new List<Stock>
    {
        new()
        {
            BatchNumber = "LOT-2026-C02",
            Product = ProductType.PoultryBreast_Sliced_1kg,
            Quantity = 14.00m,
            Source = "Poultry Processing Line 1 (SHP-2026-0009)",
            SlaughterDate = today.AddDays(-6),
            ProcessingDate = today.AddDays(-4),
            ExpiryDate = today.AddDays(20)
        },
        new()
        {
            BatchNumber = "LOT-2026-D02",
            Product = ProductType.DuckRice_Indiv_P10,
            Quantity = 40.00m,
            Source = "Prepared Meals Unit B (SHP-2026-0010)",
            SlaughterDate = today.AddDays(-7),
            ProcessingDate = today.AddDays(-5),
            ExpiryDate = today.AddDays(25)
        },
        new()
        {
            BatchNumber = "LOT-2026-R01",
            Product = ProductType.ChickenStroganoff_400g,
            Quantity = 25.00m,
            Source = "Internal Prepared Meals Line",
            SlaughterDate = today.AddDays(-3),
            ProcessingDate = today.AddDays(-1),
            ExpiryDate = today.AddDays(10)
        }
    };

    await context.Stock.AddRangeAsync(stocks);
}
    }
}
