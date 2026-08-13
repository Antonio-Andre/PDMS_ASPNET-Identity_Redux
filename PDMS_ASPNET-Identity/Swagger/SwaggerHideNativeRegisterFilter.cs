using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace PDMS;

internal class SwaggerHideNativeRegisterFilter : IOpenApiDocumentTransformer
{
    public Task TransformAsync(
        OpenApiDocument document,
        OpenApiDocumentTransformerContext context,
        CancellationToken cancellationToken)
    {
        // Esta linha remove especificamente a rota /register da documentação
        document.Paths.Remove("/register");

        // Dica extra: Se quiseres esconder no futuro outras rotas:
        // document.Paths.Remove("/manage/2fa");
        // document.Paths.Remove("/resendConfirmationEmail");

        return Task.CompletedTask;
    }
}