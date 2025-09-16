using Microsoft.AspNetCore.Mvc;
using RentalService.Data;
using RentalService.Models;
using RentalService.Services;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
// ✅ Rimosso: using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace RentalService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // ✅ Rimosso: [Authorize]
    public class RentalsController : ControllerBase
    {
        private readonly RentalDbContext _context;
        private readonly IHttpClientService _httpClientService;

        public RentalsController(RentalDbContext context, IHttpClientService httpClientService)
        {
            _context = context;
            _httpClientService = httpClientService;
        }

        [HttpPost]
        public async Task<IActionResult> RentMovie([FromBody] RentalRequest request)
        {
            // ✅ Non possiamo più recuperare l'ID utente dal token,
            // quindi useremo un ID statico a scopo di test.
            // Questa è una logica NON sicura.
            int userId = 1;

            try
            {
                var movieExists = await _httpClientService.ExistsAsync("MovieService", $"api/movies/exists/{request.MovieId}");
                if (!movieExists)
                {
                    return NotFound($"Movie with ID {request.MovieId} not found");
                }

                decimal moviePrice;
                try
                {
                    moviePrice = await _httpClientService.GetAsync<decimal>("MovieService", $"api/movies/{request.MovieId}/price");
                }
                catch
                {
                    moviePrice = 4.99m;
                }

                var rental = new Rental
                {
                    UserId = userId,
                    MovieId = request.MovieId,
                    RentedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(7),
                    TotalPrice = moviePrice,
                    ReturnedAt = null
                };

                _context.Rentals.Add(rental);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Movie rented successfully",
                    rentalId = rental.Id,
                    totalPrice = moviePrice
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserRentals()
        {
            // ✅ Poiché non c'è autenticazione, non possiamo filtrare per utente.
            // L'endpoint restituirà tutti i noleggi nel database.
            var rentals = await _context.Rentals.ToListAsync();
            return Ok(rentals);
        }

        [HttpPost("return/{id}")]
        public async Task<IActionResult> ReturnMovie(int id)
        {
            // ✅ Non possiamo più recuperare l'ID utente per la verifica di proprietà.
            var rental = await _context.Rentals.FindAsync(id);

            if (rental == null)
            {
                return NotFound("Rental not found.");
            }

            if (rental.ReturnedAt != null)
            {
                return BadRequest("Movie has already been returned.");
            }

            rental.ReturnedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok("Movie returned successfully.");
        }

        // ✅ L'endpoint per admin non ha più senso senza autenticazione e ruoli.
        // L'ho commentato per evitare problemi.
        /*
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllRentals()
        {
            var rentals = await _context.Rentals.ToListAsync();
            return Ok(rentals);
        }
        */
    }

    public class RentalRequest
    {
        public int MovieId { get; set; }
    }
}