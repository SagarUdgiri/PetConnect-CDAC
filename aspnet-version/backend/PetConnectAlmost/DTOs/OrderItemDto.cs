namespace PetConnectAlmost.DTOs
{
    public class OrderItemDto
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public int Quantity { get; set; }
        public decimal PriceAtPurchase { get; set; }
        public decimal Subtotal => Quantity * PriceAtPurchase;
    }
}
