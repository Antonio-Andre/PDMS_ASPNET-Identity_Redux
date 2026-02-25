using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PDMS.Data;
using PDMS.Models;
using PDMS.DTO;

namespace PDMS.Services
{
    public class EmployeeService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Employee> _userManager;

        public EmployeeService(ApplicationDbContext context, UserManager<Employee> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        
        public async Task<IdentityResult> RegisterEmployeeAsync(RegisterEmployeeDTO request)
        {
            Employee user = request.ToEntity();

            IdentityResult identityResult = await _userManager.CreateAsync(user, request.Password);

            var addToRoleResult = await _userManager.AddToRoleAsync(user, JobTitle.Operator.ToString());

            if (identityResult.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, JobTitle.Operator.ToString());
            }
            return identityResult;
        }

        public async Task<List<EmployeeResponseDTO>> GetAllEmployees()
        {
            var employees = await _context.Employees.ToListAsync();

            return employees.Select(e => new EmployeeResponseDTO(
                e.Id,
                e.Name,
                e.Email!,
                e.Department,
                e.PhoneNumber,
                e.EnableNotifications 
            )).ToList();
        }

        public async Task<Employee?> GetEmployeeById(int id)
        {
            return await _context.Employees.FindAsync(id);
        }

        public async Task<bool> UpdateEmployeeAsync(int id, UpdateEmployeeDTO request)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;

            request.UpdateEntity(employee);

            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AdminUpdateEmployeeAsync(int id, AdminUpdateEmployeeDTO request)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;

            request.AdminUpdateEntity(employee);

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;

            _context.Employees.Remove(employee);

            await _context.SaveChangesAsync();
            return true;
        }


    }
}
