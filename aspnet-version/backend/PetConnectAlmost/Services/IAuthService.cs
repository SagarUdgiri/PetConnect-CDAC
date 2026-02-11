using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public interface IAuthService
    {
        Task<object> RegisterAsync(RegisterRequest request);
        Task<object> LoginAsync(LoginRequest request);
        Task<object> VerifyOtpAsync(OtpVerifyRequest request);

        Task<List<NearbyUserDto>> GetAllNearbyUsers(long userId, double radiusKm);
        Task<List<NearbyUserDto>> GetAllNearbyUsers(long userId, double userLat, double userLong, double radiusKm);
    }
}
