# Stage 1: Build da aplicação C#
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY *.csproj ./
RUN dotnet restore

COPY . ./
# Compila apenas o projeto C# local (sem procurar pela solução inteira)
RUN dotnet publish PDMS.csproj -c Release -o /app/publish

# Stage 2: Runtime leve para execução
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "PDMS.dll"]