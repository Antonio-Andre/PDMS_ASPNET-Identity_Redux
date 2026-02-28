using Microsoft.AspNetCore.Mvc;
using PDMS.DTO;
using PDMS.Models;
using PDMS.Services;

namespace PDMS.Endpoints
{
    public static class VanEndpoints
    {
        public static void RegisterVanEndpoints(this WebApplication app)
        {
            var vans = app.MapGroup("/api/vans").WithTags("Vans");

            vans.MapGet("/", GetAllVans);
            vans.MapGet("/{id:int}", GetVanById);
            vans.MapPost("/", CreateVan).RequireAuthorization(policy => policy.RequireRole("Admin"));
            vans.MapPut("/{id:int}", UpdateVan);
            vans.MapDelete("/{id:int}", DeleteVan).RequireAuthorization(policy => policy.RequireRole("Admin"));
        }

        public static async Task<IResult> GetAllVans([FromServices] VanService vanService)
        {
            var vans = await vanService.GetAllVansAsync();
            return Results.Ok(vans);
        }

        public static async Task<IResult> GetVanById(int id, [FromServices] VanService vanService)
        {
            var van = await vanService.GetVanByIdAsync(id);

            if (van is null)
                return Results.NotFound(new { Message = $"Carrinha com ID {id} não encontrada." });

            var response = new VanResponseDTO(
                van.Id,
                van.LicensePlate,
                van.DataOfInspection,
                van.MaxLoadKg,
                van.MaxVolumeM3,
                van.Status.ToString()
            );

            return Results.Ok(response);
        }

        public static async Task<IResult> CreateVan(CreateVanDTO request, [FromServices] VanService vanService)
        {
            var newVan = await vanService.CreateVanAsync(request);
            return Results.Created($"/api/vans/{newVan.Id}", newVan);
        }

        public static async Task<IResult> UpdateVan(int id, UpdateVanDTO request, [FromServices] VanService vanService)
        {
            var success = await vanService.UpdateVanAsync(id, request);

            if (!success)
                return Results.NotFound(new { Message = "Carrinha não encontrada para atualização." });

            return Results.NoContent();
        }

        public static async Task<IResult> DeleteVan(int id, [FromServices] VanService vanService)
        {
            var success = await vanService.DeleteVanAsync(id);

            if (!success)
                return Results.NotFound(new { Message = "Carrinha não encontrada para eliminação." });

            return Results.NoContent();
        }
    }
}
