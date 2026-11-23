using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.DataProtection;
using PDMS;
using PDMS.Data;
using PDMS.Endpoints;
using PDMS.Models;
using PDMS.Services;
using Scalar.AspNetCore;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi("v1");

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddDataProtection()
    .PersistKeysToDbContext<ApplicationDbContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("" +
            "http://localhost:5173", /*Frontend uri:port*/
            "http://localhost:3000", /*Docker uri:port*/
            "https://pdms-frontend-jyba.onrender.com") //Render
              .AllowAnyHeader()                     
              .AllowAnyMethod()                    
              .AllowCredentials();                  
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<Employee, IdentityRole<int>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddTransient<IEmailSender<Employee>, NoOpEmailSender<Employee>>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromHours(2);
    options.SlidingExpiration = true;
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.AddAuthorization();






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




if (app.Environment.IsDevelopment())

{

    app.UseDeveloperExceptionPage();

}

else

{
    app.UseHsts();
    app.UseHttpsRedirection();

}


app.UseCors("ReactPolicy");

app.UseAuthentication();
app.UseAuthorization();


app.MapGet("users/me", async (ClaimsPrincipal claims, ApplicationDbContext context) => {
    string? userId = claims.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

    var employee = await context.Employees.FindAsync(int.Parse(userId));

    return employee is not null ? Results.Ok(employee) : Results.NotFound();

}).RequireAuthorization();
app.MapHomeEndpoint();
app.RegisterEmployeeEndpoints();
app.RegisterCompanyEndpoints();
app.RegisterVanEndpoints();
app.RegisterShipmentEndpoints();
app.RegisterStockEndpoints();
app.MapFallbackToFile("index.html");



app.MapIdentityApi<Employee>();

app.Run();


