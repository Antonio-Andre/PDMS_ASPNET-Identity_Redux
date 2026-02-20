using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Security.Claims;
using test_Identity_from_Scratch.Data;
using test_Identity_from_Scratch.Features;
using test_Identity_from_Scratch.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.DocumentFilter<SwaggerHideNativeRegisterFilter>();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Onde o teu React vai morar
              .AllowAnyHeader()                     
              .AllowAnyMethod()                    
              .AllowCredentials();                  // OBRIGATÓRIO para os Cookies funcionarem!
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
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))); //need to re-check this later

var app = builder.Build();



// Do this in a helper function later, avoid polluting the main program file, only for development purposes
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    using var scope = app.Services.CreateScope();
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

RegisterUser.MapEndpoint(app);
app.MapIdentityApi<Employee>();

app.Run();


