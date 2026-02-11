using PetConnectAlmost.Models;
using System.ComponentModel.DataAnnotations;

namespace PetConnectAlmost.DTOs
{
    public class CreatePostDto
    {
        [Required]
        public long UserId { get; set; }  

        [Required]
        public string? Title { get; set; }

        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        public string Visibility { get; set; } = "PUBLIC";
    }
}
