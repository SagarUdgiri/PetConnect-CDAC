namespace PetConnectAlmost.Models
{
    public class ErrorResponse
    {
        public string Message { get; set; } = string.Empty;
        public string? Error { get; set; }
        public int StatusCode { get; set; }
        public string? Details { get; set; }
    }
}
