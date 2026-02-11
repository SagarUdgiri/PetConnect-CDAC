using System.ComponentModel.DataAnnotations;

namespace PetConnectAlmost.DTOs
{
    public class CUProductRequest
    {
        [Required] public string Name { get; set; } = null!;
        public string? Description { get; set; }
        [Range(0, double.MaxValue)] public decimal Price { get; set; }
        public int Quantity { get; set; } = 0;
        public string? ImageUrl { get; set; }
        [Required] public string Category { get; set; } = null!;
    }
}
