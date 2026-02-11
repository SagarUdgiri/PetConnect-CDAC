using PetConnectAlmost.Models;

namespace PetConnectAlmost.DTOs
{
    public class PostDto
    {
        public long PostId { get; set; }
        public long UserId { get; set; }
        public string UserFullName { get; set; } = string.Empty;  // From join
        [System.Text.Json.Serialization.JsonPropertyName("userProfileImageUrl")]
        public string? UserProfileImageUrl { get; set; } // From join
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string Visibility { get; set; } = "PUBLIC";
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int LikesCount { get; set; }
        public List<CommentDto> Comments { get; set; } = [];
    }
}
