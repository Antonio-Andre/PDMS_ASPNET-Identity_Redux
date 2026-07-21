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

    public DbSet<Stock> Stock { get; set; }
    public DbSet<Van> Vans { get; set; }
    public DbSet<Shipment> Deliveries { get; set; }
    public DbSet<ShipmentItem> ShipmentItems { get; set; }
    public DbSet<ReturnedItem> ReturnedItems { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<BusinessGroup> BusinessGroups { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Van>()
            .HasIndex(c => c.LicensePlate).IsUnique();
        
        builder.Entity<Employee>()
            .HasIndex(f => f.TaxId).IsUnique();
        
        builder.Entity<Employee>()
            .Property(e => e.Email)
            .IsRequired();

        builder.Entity<Company>(entity =>
        {
            entity.HasIndex(e => e.TaxId).IsUnique();
            entity.Property(c => c.ShareCapital).HasColumnType("decimal(18,2)");
        });

        builder.Entity<Shipment>(entity =>
        {
            entity.HasIndex(s => s.RegisterNumber).IsUnique(); 
        });

        builder.Entity<ShipmentItem>()
            .HasOne<Shipment>()         
            .WithMany(s => s.Items)       
            .HasForeignKey(i => i.ShipmentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Employee>(entity =>
        {
            entity.Property(e => e.EnableNotifications).HasDefaultValue(true);
            entity.Property(e => e.Initials).HasMaxLength(5);
        });
        builder.HasDefaultSchema("identity");

        foreach (var property in builder.Model.GetEntityTypes()
        .SelectMany(t => t.GetProperties())
        .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
        {
            property.SetPrecision(18);
            property.SetScale(2);
        }
    }   
}
