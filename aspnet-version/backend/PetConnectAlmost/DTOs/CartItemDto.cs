namespace PetConnectAlmost.DTOs
{
    public class CartItemDto
    {
        public long CartItemId { get; set; }
        public long ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal => Price * Quantity;
    }
}
