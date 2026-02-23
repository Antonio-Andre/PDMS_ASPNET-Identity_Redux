using Azure.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PDMS.Data;
using PDMS.Endpoints.EmployeeEndpoints;
using PDMS.Models;

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
        
        public async Task<IdentityResult> RegisterEmployeeAsync(UserRequest request)
        {

            var user = new Employee
            {
                UserName = request.Email,
                Email = request.Email,
                Name = request.Name,
                Initials = request.Initials,
                taxId = request.TaxId,
                Department = string.IsNullOrWhiteSpace(request.Department) ? "Unassigned" : request.Department,
                PhoneNumber = request.PhoneNumber,
                EnableNotifications = request.EnableNotifications,
                DateOfAdmission = DateOnly.FromDateTime(DateTime.Now),
                Status = EmployeeStatus.Active
            };


            IdentityResult identityResult = await _userManager.CreateAsync(user, request.Password);

            var addToRoleResult = await _userManager.AddToRoleAsync(user, JobTitle.Operator.ToString());

            if (identityResult.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, JobTitle.Operator.ToString());
            }

            return identityResult;
        }

        public async Task<List<Employee>> GetAllEmployees()
        {
            return await _context.Employees.ToListAsync();
        }

        public async Task<Employee?> GetEmployeeById(int id)
        {
            return await _context.Employees.FindAsync(id);
        }

        public async Task<bool> UpdateEmployeeAsync(int id, UserRequest request)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;

            employee.Name = request.Name;
            employee.Initials = request.Initials;
            employee.taxId = request.TaxId;
            employee.PhoneNumber = request.PhoneNumber;
            employee.EnableNotifications = request.EnableNotifications;

            _context.Employees.Update(employee);
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

        public async Task<bool> AdminUpdateEmployeeAsync(int id, UserRequest request)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;

            employee.Email = request.Email;
            employee.UserName = request.Email;
            employee.Department = request.Department;
            employee.Name = request.Name;
            employee.taxId = request.TaxId;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
