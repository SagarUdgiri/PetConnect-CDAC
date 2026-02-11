using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.Data;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<object>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Username,
                    u.Email,
                    u.Role,
                    u.Phone,
                    u.ImageUrl,
                    u.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<object?> GetUserByIdAsync(long id)
        {
            return await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Username,
                    u.Email,
                    u.Role,
                    u.Phone,
                    u.ImageUrl,
                    u.Bio,
                    u.CreatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserEntityByIdAsync(long id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<bool> DeleteUserAsync(long id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<object> GetSystemStatsAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalPets = await _context.Pets.CountAsync();
            var totalPosts = await _context.Posts.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();
            var totalRevenue = await _context.Orders.Where(o => o.Status == "PAID").SumAsync(o => o.TotalPrice);

            return new
            {
                totalUsers,
                totalPets,
                totalPosts,
                totalOrders,
                totalRevenue
            };
        }

        public async Task<object> UpdateUserAsync(long userId, UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return new ErrorResponse { Message = "User not found", Error = "NotFound", StatusCode = 404 };

            if (!string.IsNullOrWhiteSpace(request.FullName)) user.FullName = request.FullName;
            if (request.Phone != null) user.Phone = request.Phone;
            if (request.Bio != null) user.Bio = request.Bio;
            if (request.ImageUrl != null) user.ImageUrl = request.ImageUrl;
            
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GetUserByIdAsync(userId) ?? new { };
        }
    }
}
