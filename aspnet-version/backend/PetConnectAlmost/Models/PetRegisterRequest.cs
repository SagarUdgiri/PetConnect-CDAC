namespace PetConnectAlmost.Models
{
    public class PetRegisterRequest
    {
        public string PetName { get; set; } = string.Empty;
        public string Species { get; set; } = string.Empty;
        public string Breed { get; set; } = string.Empty;
        public int Age { get; set; }
        public string? ImageUrl { get; set; }
    }
}
