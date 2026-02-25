using Microsoft.AspNetCore.Mvc;
using PDMS.DTO;
using PDMS.Services;


namespace PDMS.Endpoints
{
    public static class EmployeesEnpoints
    {
        public static void RegisterEmployeeEndpoints(this WebApplication app)
        {
            var employees = app.MapGroup("/api/employees");

            employees.MapGet("/", GetAllEmployees);
            employees.MapGet("/{id}", GetEmployeeById);
            employees.MapPost("/", RegisterEmployee);
            employees.MapPut("/{id}", UpdateEmployeeById);
            employees.MapDelete("/{id}", DeleteEmploye)
                .RequireAuthorization(policy => policy.RequireRole("Admin"));

            employees.MapPut("/{id}/admin-update", AdminUpdateEmployee)
             .RequireAuthorization(policy => policy.RequireRole("Admin"));
        }
        public static async Task<IResult> GetAllEmployees([FromServices] EmployeeService employeeService)
        {
            var employees = await employeeService.GetAllEmployees();

            return Results.Ok(employees);
        }

        public static async Task<IResult> GetEmployeeById(int id, [FromServices] EmployeeService employeeService)
        {
            var employee = await employeeService.GetEmployeeById(id);

            return employee is not null
                ? Results.Ok(new EmployeeResponseDTO(employee))
                : Results.NotFound();
        }

        public static async Task<IResult> RegisterEmployee(RegisterEmployeeDTO request, [FromServices] EmployeeService employeeService)
        {
            var result = await employeeService.RegisterEmployeeAsync(request);

            if (!result.Succeeded)
            {
                return Results.BadRequest(result.Errors);
            }

            return Results.Ok(new { Message = "Employee registered successfully!" });
        }

        public static async Task<IResult> UpdateEmployeeById(int id, UpdateEmployeeDTO request, [FromServices] EmployeeService employeeService)
        {
            var success = await employeeService.UpdateEmployeeAsync(id, request);

            if (!success)
            {
                return Results.NotFound(new { message = $"Funcionário com ID {id} não encontrado." });
            }

            return Results.NoContent();
        }
        public static async Task<IResult> AdminUpdateEmployee(int id, AdminUpdateEmployeeDTO request, [FromServices] EmployeeService employeeService)
        {
            var success = await employeeService.AdminUpdateEmployeeAsync(id, request);

            return success
                ? Results.Ok(new { message = "Dados sensíveis atualizados pelo Administrador." })
                : Results.NotFound();
        }


        public static async Task<IResult> DeleteEmploye(int id, [FromServices] EmployeeService employeeService)
        {
            var success = await employeeService.DeleteEmployeeAsync(id);

            return success
                ? Results.Ok(new { message = "Funcionário e conta removidos permanentemente." })
                : Results.NotFound();
        }

    }
}
