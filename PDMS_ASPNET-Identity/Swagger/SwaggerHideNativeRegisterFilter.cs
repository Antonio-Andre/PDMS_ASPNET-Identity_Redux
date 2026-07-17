using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;

internal class SwaggerHideNativeRegisterFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        // Esta linha remove especificamente a rota /register do Swagger
        // permitindo que apenas a tua /api/register apareça
        swaggerDoc.Paths.Remove("/register");

        // Dica extra: Se quiseres esconder também a rota de 2FA ou Resend que o Identity cria:
        // swaggerDoc.Paths.Remove("/manage/2fa");
        // swaggerDoc.Paths.Remove("/resendConfirmationEmail");
    }
}