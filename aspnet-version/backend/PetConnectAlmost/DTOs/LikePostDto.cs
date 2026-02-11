using System.ComponentModel.DataAnnotations;

namespace PetConnectAlmost.DTOs
{
    public class LikePostDto
    {
        [Required]
        public long UserId { get; set; }

        [Required]
        public long PostId { get; set; }
    }
}
