namespace PetConnectAlmost.DTOs
{
    public class PetDietRequestDto
    {
        public string? PetName { get; set; }
        public string PetType { get; set; }
        public string? Breed { get; set; }
        public int AgeYears { get; set; }
        public double WeightKg { get; set; }
        public string ActivityLevel { get; set; }
        public string Goal { get; set; }
    }
}
