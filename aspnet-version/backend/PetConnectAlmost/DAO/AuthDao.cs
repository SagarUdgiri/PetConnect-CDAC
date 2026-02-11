using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.Data;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public class AuthDao : IAuthDao
    {
        private readonly ApplicationDbContext _context;

        public AuthDao(ApplicationDbContext context)
        {
            _context = context;
        }

        public bool EmailExists(string email)
        {
            return _context.Users.Any(u => u.Email == email);
        }

        public bool UsernameExists(string username)
        {
            return _context.Users.Any(u => u.Username == username);
        }

        public void AddUser(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public async Task<User?> GetUserByUsernameAsync(string username) => 
            await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

        public async Task<User?> GetUserByIdAsync(long id) => 
            await _context.Users.FindAsync(id);
        public User? GetUserByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
    }
}
