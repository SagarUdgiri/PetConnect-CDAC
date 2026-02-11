namespace PetConnectAlmost.Services
{
    public class OtpService
    {
        public string GenerateOtp()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }
}
