using Microsoft.EntityFrameworkCore;
using PDMS.Data;
using PDMS.DTO;
using PDMS.Models;

namespace PDMS.Services
{
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
                v.InspectionDate,
                v.MaxLoadKg,
                v.CurrentLoadKg,
                v.Status.ToString()
            )).ToList();
        }

        public async Task<VanResponseDTO?> GetVanByIdAsync(int id)
        {
            var van = await _context.Vans.FindAsync(id);
            if (van == null) return null;

            return new VanResponseDTO(
                van.Id,
                van.LicensePlate,
                van.InspectionDate,
                van.MaxLoadKg,
                van.CurrentLoadKg,
                van.Status.ToString()
            );
        }

        public async Task<Van> CreateVanAsync(CreateVanDTO request)
        {
            var van = new Van
            {
                LicensePlate = request.LicensePlate,
                InspectionDate = request.InspectionDate,
                MaxLoadKg = request.MaxLoadKg,
                CurrentLoadKg = request.CurrentLoadKg,
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

            van.InspectionDate = request.InspectionDate;
            van.Status = request.Status;
            van.CurrentLoadKg = request.CurrentLoadKg;

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
}