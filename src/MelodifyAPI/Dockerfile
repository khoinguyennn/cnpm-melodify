FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

# Tạo thư mục và cấp quyền trước khi dùng USER app
WORKDIR /app
RUN mkdir -p /app/wwwroot/data/{audio,artists,img,playlist,users} \
    && mkdir -p /app/logs \
    && chown -R app:app /app \
    && chmod -R 755 /app

# Sử dụng user không phải root
USER app
EXPOSE 7153

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["MelodifyAPI/MelodifyAPI.csproj", "MelodifyAPI/"]
RUN dotnet restore "MelodifyAPI/MelodifyAPI.csproj"
COPY . .
WORKDIR "/src/MelodifyAPI"
RUN dotnet build "MelodifyAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "MelodifyAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
RUN mkdir -p /home/app/.aspnet/DataProtection-Keys
VOLUME /home/app/.aspnet/DataProtection-Keys
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MelodifyAPI.dll"]
