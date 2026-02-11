namespace PetConnectAlmost.Services
{
    public class OtpStore
    {
        public static Dictionary<string, (string Otp, DateTime Expiry)>
            OtpMap = new Dictionary<string, (string, DateTime)>();
    }
}
