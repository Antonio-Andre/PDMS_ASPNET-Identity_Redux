using Microsoft.EntityFrameworkCore;
using PDMS.Data;
using PDMS.DTO;
using PDMS.Models;

public class VanService
{
    private readonly ApplicationDbContext _context;
    public VanService(ApplicationDbContext context) => _context = context;
    public async Task<List<VanResponseDTO>> GetAllVansAsync()
    {
        var vans = await _context.Vans.ToListAsync();

        return vans.Select(v => new VanResponseDTO(
            v.Id,
            v.LicensePlate,
            v.DataOfInspection,
            v.MaxLoadKg,
            v.Status.ToString()
        )).ToList();
    }

    public async Task<VanResponseDTO?> GetVanByIdAsync(int id)
    {
        var v = await _context.Vans.FindAsync(id);
        if (v == null) return null;
        return new VanResponseDTO(
            v.Id,
            v.LicensePlate,
            v.DataOfInspection,
            v.MaxLoadKg,
            v.Status.ToString()
        );
    }

    public async Task<Van> CreateVanAsync(CreateVanDTO request)
    {
        var van = new Van
        {
            LicensePlate = request.LicensePlate,
            DataOfInspection = request.DataOfInspection,
            MaxLoadKg = request.MaxLoadKg,
            Status = VanStatus.Available 
        };

        _context.Vans.Add(van);
        await _context.SaveChangesAsync();
        return van;
    }

    public async Task<bool> UpdateVanAsync(int id, UpdateVanDTO request)
    {
        var van = await _context.Vans.FindAsync(id);
        if (van == null) return false;

        van.DataOfInspection = request.DataOfInspection;
        van.MaxLoadKg = request.MaxLoadKg;
        van.Status = request.Status;

        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<bool> DeleteVanAsync(int id)
    {
        var van = await _context.Vans.FindAsync(id);
        if (van == null) return false;

        _context.Vans.Remove(van);
        await _context.SaveChangesAsync();
        return true;
    }
}