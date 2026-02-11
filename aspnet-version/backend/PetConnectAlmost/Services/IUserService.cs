using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public interface IUserService
    {
        Task<IEnumerable<object>> GetAllUsersAsync();
        Task<object?> GetUserByIdAsync(long id);
        Task<User?> GetUserEntityByIdAsync(long id);
        Task<bool> DeleteUserAsync(long id);
        Task<object> GetSystemStatsAsync();
        Task<object> UpdateUserAsync(long userId, UpdateUserRequest request);
    }

    public class UpdateUserRequest
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Bio { get; set; }
        public string? ImageUrl { get; set; }
    }
}
