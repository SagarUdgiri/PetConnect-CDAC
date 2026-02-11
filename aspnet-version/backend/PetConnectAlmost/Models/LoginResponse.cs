namespace PetConnectAlmost.Models
{
    public class LoginResponse
    {
        // User identity
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }

        // Login / OTP status
        public bool OtpSent { get; set; }
        public DateTime OtpExpiry { get; set; }

        // UI / message support
        public string Message { get; set; }
    }
}
