namespace PetConnectAlmost.DTOs
{
    public class NearbyUserDto
    {
        public long UserId { get; set; }
        public string FullName { get; set; }
        public string ProfilePictureUrl { get; set; }
        public double Distance { get; set; } 

        public List<PetSummaryDto> Pets { get; set; }
    }
}
