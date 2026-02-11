namespace PetConnectAlmost.DTOs
{
    public class OrderDetailsDto
    {
        public long OrderId { get; set; }
        public decimal TotalPrice { get; set; }
        public string OrderStatus { get; set; } = null!;
        public string? TransactionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = [];
    }
}
