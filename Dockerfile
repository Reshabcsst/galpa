# Use the official ASP.NET Core runtime as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

# Use the official .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Galpa/Galpa.csproj", "Galpa/"]
RUN dotnet restore "./Galpa/Galpa.csproj"
COPY . . # Copy all remaining files
WORKDIR "/src/Galpa"
RUN dotnet build "./Galpa.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Galpa.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish . # Copy published files to the final image
ENTRYPOINT ["dotnet", "Galpa.dll"] # Specify the entry point for the application
