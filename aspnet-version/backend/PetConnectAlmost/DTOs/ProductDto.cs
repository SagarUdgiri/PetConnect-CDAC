namespace PetConnectAlmost.DTOs
{
    public class ProductDto
    {
        public long ProductId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public bool IsAvailable { get; set; }
        public string? ImageUrl { get; set; }
        public string Category { get; set; } = null!;
    }
}
