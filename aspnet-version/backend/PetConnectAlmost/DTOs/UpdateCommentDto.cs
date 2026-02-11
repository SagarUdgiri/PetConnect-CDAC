using System.ComponentModel.DataAnnotations;

namespace PetConnectAlmost.DTOs
{
    public class UpdateCommentDto
    {
        [Required]
        public long UserId { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;
    }
}
