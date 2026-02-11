using System.ComponentModel.DataAnnotations;

namespace PetConnectAlmost.DTOs
{
    public class AddToCartRequest
    {
        [Required] public long ProductId { get; set; }
        [Range(1, int.MaxValue)] public int Quantity { get; set; } = 1;
    }
}
