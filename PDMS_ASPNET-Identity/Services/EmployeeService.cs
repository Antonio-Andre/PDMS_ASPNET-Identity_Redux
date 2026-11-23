using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PDMS.Data;
using PDMS.Models;
using PDMS.DTO;
using System.Security.Claims;
using System.Xml.XPath;


namespace PDMS.Services
{
    public class EmployeeService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Employee> _userManager;
        private readonly SignInManager<Employee> _signInManager;
        private readonly ILogger<EmployeeService> _logger;

        public EmployeeService(ApplicationDbContext context, UserManager<Employee> userManager, SignInManager<Employee> signInManager, ILogger<EmployeeService> logger)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }
        
        public async Task<IdentityResult> RegisterEmployeeAsync(RegisterEmployeeDTO request)
        {
            Employee user = request.ToEntity();

            IdentityResult identityResult = await _userManager.CreateAsync(user, request.Password);

            if (!identityResult.Succeeded)
            {
                return identityResult;
            }

            return await _userManager.AddToRoleAsync(user, JobTitle.Operator.ToString());
        }

        public async Task<SignInResult> LoginAsync(LoginRequestDTO request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null) return SignInResult.Failed;
            
            var result = await _signInManager.PasswordSignInAsync
                (
                    user,
                    request.Pwd,
                    isPersistent: true,
                    lockoutOnFailure: false
                );

            Console.WriteLine($"[LOGIN DEBUG] UserFound={user != null}, Succeeded={result.Succeeded}, LockedOut={result.IsLockedOut}, NotAllowed={result.IsNotAllowed}, TwoFactor={result.RequiresTwoFactor}");

            return result;
                
        }

public async Task<Employee?> GetCurrentEmployeeAsync(ClaimsPrincipal principal)
{
    if (principal.Identity?.IsAuthenticated != true)
    {
        _logger.LogDebug("Principal is not authenticated when resolving current employee.");
        return null;
    }

    var nameId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var user = await _userManager.GetUserAsync(principal);

    _logger.LogDebug(
        "Resolved current employee. NameId={NameId}, UserFound={UserFound}",
        nameId,
        user is not null);

    return user;
}

        public async Task<List<EmployeeResponseDTO>> GetAllEmployees()
        {
            var employees = await _context.Employees.ToListAsync();

            return employees.Select(e => new EmployeeResponseDTO(e)).ToList();
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
