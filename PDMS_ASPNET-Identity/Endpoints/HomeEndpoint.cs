namespace PDMS.Endpoints
{
    public static class HomeEndpoint
    {
        public static void MapHomeEndpoint(this WebApplication routes)
        {
            routes.MapGet("/home", async () =>
            {
                return Results.Ok(new { message = "Bem-vindo à API do PDMS!" });
            });
        }
    }
}
