namespace PetConnectAlmost.DTOs
{
    public class NotificationDto
    {
        public long NotificationId { get; set; }
        public long UserId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public long? RelatedPostId { get; set; }
        public long? SenderId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
