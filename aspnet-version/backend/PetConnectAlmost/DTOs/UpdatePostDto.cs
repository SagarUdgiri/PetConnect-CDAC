using PetConnectAlmost.Models;

namespace PetConnectAlmost.DTOs
{
    public class UpdatePostDto
    {
        public long UserId { get; set; }  

        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Visibility { get; set; }
    }
}
