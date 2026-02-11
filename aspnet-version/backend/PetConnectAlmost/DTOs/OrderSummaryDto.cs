namespace PetConnectAlmost.DTOs
{
    public class OrderSummaryDto
    {
        public long OrderId { get; set; }
        public decimal TotalPrice { get; set; }
        public string OrderStatus { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public int ItemsCount { get; set; }
    }
}
