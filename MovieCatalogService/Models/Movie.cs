using System;
using System.ComponentModel.DataAnnotations;

namespace MovieCatalogService.Models
{
    public class Movie
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty; // Inizializza con valore default

        [StringLength(500)]
        public string? Description { get; set; } // nullable

        [Range(0.01, 100)]
        public decimal? Price { get; set; }
        
         [StringLength(100)]
         public string? Director { get; set; } // nullable

        [Range(1, 300)]
        public int? Duration { get; set; } // nullable

        [StringLength(50)]
        public string? Category { get; set; } // nullable

        [Range(1900, 2100)]
        public int? ReleaseYear { get; set; } // nullable

        public DateTime? CreatedAt { get; set; } // nullable
    }
}