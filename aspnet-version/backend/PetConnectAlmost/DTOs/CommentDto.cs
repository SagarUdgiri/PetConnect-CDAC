namespace PetConnectAlmost.DTOs
{
    public class CommentDto
    {
        public long CommentId { get; set; }
        public long UserId { get; set; }
        public string UserFullName { get; set; } = string.Empty;
        [System.Text.Json.Serialization.JsonPropertyName("userProfileImageUrl")]
        public string? UserProfileImageUrl { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}