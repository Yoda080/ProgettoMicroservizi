using Microsoft.EntityFrameworkCore;
using MovieCatalogService.Data;
using MovieCatalogService.Services;
using Microsoft.AspNetCore.Cors; // AGGIUNGI QUESTO USING

var builder = WebApplication.CreateBuilder(args);

// Aggiungi servizi al container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// AGGIUNGI LA CONFIGURAZIONE CORS QUI
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Porta del tuo React
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configura il DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlServer(connectionString)
);

// Aggiungi HttpClient factory
builder.Services.AddHttpClient();

// Aggiungi servizio per comunicazione tra microservizi
builder.Services.AddScoped<IHttpClientService, HttpClientService>();

var app = builder.Build();

// Configura la pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// USA CORS PRIMA DI TUTTO - AGGIUNGI QUESTA RIGA
app.UseCors("AllowReactApp"); // ← QUESTA RIGA È ESSENZIALE

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();