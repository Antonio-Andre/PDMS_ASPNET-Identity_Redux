using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using PDMS.Models;

namespace PDMS.Data;


public class ApplicationDbContext : IdentityDbContext<Employee, IdentityRole<int>, int>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options){}

    public DbSet<Stock> Stocks { get; set; }
    public DbSet<Van> Vans { get; set; }
    public DbSet<Shipment> Deliveries { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<HoldingCompany> HoldingCompanies { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Unicidade de Matrícula
        builder.Entity<Van>()
            .HasIndex(c => c.LicensePlate).IsUnique();
        builder.Entity<Employee>()
            .HasIndex(f => f.taxId).IsUnique();
        builder.Entity<Company>()
            .HasIndex(e => e.taxId).IsUnique();

        builder.Entity<Shipment>()
            .HasIndex(e => e.RegisterNumber).IsUnique();

        builder.Entity<Employee>(entity =>
        {
            entity.Property(e => e.EnableNotifications).HasDefaultValue(true);
            entity.Property(e => e.Initials).HasMaxLength(5);
        });
        builder.HasDefaultSchema("identity");

        foreach (var property in builder.Model.GetEntityTypes()
        .SelectMany(t => t.GetProperties())
        .Where(p => p.ClrType == typeof(decimal)))
        {
            property.SetPrecision(18);
            property.SetScale(2);
        }
    }   
}
