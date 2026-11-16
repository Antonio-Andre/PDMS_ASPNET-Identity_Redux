using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PDMS;
using PDMS.Data;
using PDMS.Endpoints;
using PDMS.Models;
using PDMS.Services;
using Scalar.AspNetCore;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi("v1");

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("" +
            "http://localhost:5173",
            "http://localhost:3000", /*Frontend uri:port + docker:port*/
            "https://pdms-frontend-jyba.onrender.com")
              .AllowAnyHeader()                     
              .AllowAnyMethod()                    
              .AllowCredentials();                  
    });
});

builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies();
builder.Services.AddAuthorization();

builder.Services.AddIdentityCore<Employee>()
    .AddRoles<IdentityRole<int>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddApiEndpoints();


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<EmployeeService>();
builder.Services.AddScoped<CompanyService>();
builder.Services.AddScoped<VanService>();
builder.Services.AddScoped<ShipmentService>();
//builder.Services.AddScoped<ShipmentItemService>();
builder.Services.AddScoped<StockService>();

var app = builder.Build();


app.MapOpenApi(); 
app.MapScalarApiReference(options =>
{
    options
        .WithTitle("PDMS API")
        .AddDocument("v1", "/openapi/v1.json");
});

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
    await DbInitializer.Initialize(scope.ServiceProvider);
}


app.MapGet("users/me", async (ClaimsPrincipal claims, ApplicationDbContext context) => {
    string? userId = claims.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

    var employee = await context.Employees.FindAsync(int.Parse(userId));

    return employee is not null ? Results.Ok(employee) : Results.NotFound();

}).RequireAuthorization();

app.UseHttpsRedirection();

app.UseCors("ReactPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapHomeEndpoint();
app.RegisterEmployeeEndpoints();
app.RegisterCompanyEndpoints();
app.RegisterVanEndpoints();
app.RegisterShipmentEndpoints();
app.RegisterStockEndpoints();



app.MapIdentityApi<Employee>();

app.Run();


