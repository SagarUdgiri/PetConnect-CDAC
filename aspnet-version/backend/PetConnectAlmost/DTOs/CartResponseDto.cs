namespace PetConnectAlmost.DTOs
{
    public class CartResponseDto
    {
        public List<CartItemDto> Items { get; set; } = [];
        public int TotalItems => Items.Sum(i => i.Quantity);
        public decimal TotalPrice => Items.Sum(i => i.Subtotal);
    }
}
