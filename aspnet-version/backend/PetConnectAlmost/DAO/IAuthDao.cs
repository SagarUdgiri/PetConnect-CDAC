using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public interface IAuthDao
    {
        bool EmailExists(string email);
        bool UsernameExists(string username);
        void AddUser(User user);
        User? GetUserByEmail(string email);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByIdAsync(long id);
        Task<List<User>> GetAllUsersAsync();
    }
}
