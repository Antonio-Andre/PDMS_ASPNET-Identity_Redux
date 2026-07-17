using Microsoft.AspNetCore.Identity;
using test_Identity_from_Scratch.Models;
using test_Identity_from_Scratch.Data;

namespace test_Identity_from_Scratch.Features
{
    public class RegisterUser
    {
        // O Request define os campos que o Swagger vai pedir
        public record Request(
            string Email,
            string Password,
            string Initials,
            string Name,
            string TaxId,
            string Department,
            string PhoneNumber,
            bool EnableNotifications = false
        );

        public static void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPost("api/register", async (Request request, UserManager<Employee> userManager) =>
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

                IdentityResult identityResult = await userManager.CreateAsync(user, request.Password);

                if (!identityResult.Succeeded)
                {
                    return Results.BadRequest(identityResult.Errors);
                }

                var addToRoleResult = await userManager.AddToRoleAsync(user, JobTitle.Operator.ToString());

                if (!addToRoleResult.Succeeded)
                {
                    return Results.BadRequest(new { message = "Utilizador criado, mas erro na Role", errors = addToRoleResult.Errors });
                }

                return Results.Ok(new
                {
                    user.Id,
                    user.Name,
                    user.Initials,
                    user.Email,
                    user.taxId
                });
            });
        }
    }
}