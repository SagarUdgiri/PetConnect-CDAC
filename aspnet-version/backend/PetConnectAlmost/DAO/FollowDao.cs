using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.Data;
using PetConnectAlmost.Models;
using System.Linq;

namespace PetConnectAlmost.DAO
{
    public class FollowDao : IFollowDao
    {
        private readonly ApplicationDbContext _context;

        public FollowDao(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> FollowUserAsync(long followerId, long followingId)
        {
            if (await IsFollowingAsync(followerId, followingId) || await HasPendingRequestAsync(followerId, followingId))
                return false;

            var follow = new Follow
            {
                FollowerId = followerId,
                FollowingId = followingId,
                Status = "PENDING",
                CreatedAt = DateTime.UtcNow
            };
            _context.Follows.Add(follow);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> AcceptFollowRequestAsync(long followerId, long followingId)
        {
            var follow = await _context.Follows
                .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowingId == followingId && f.Status == "PENDING");

            if (follow == null) return false;

            follow.Status = "ACCEPTED";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnfollowUserAsync(long followerId, long followingId)
        {
            var existing = await _context.Follows
                .FirstOrDefaultAsync(f =>
                    (f.FollowerId == followerId && f.FollowingId == followingId) ||
                    (f.FollowerId == followingId && f.FollowingId == followerId));

            if (existing == null) return true;

            _context.Follows.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsFollowingAsync(long followerId, long followingId)
        {
            return await _context.Follows.AnyAsync(f => f.FollowerId == followerId && f.FollowingId == followingId && f.Status == "ACCEPTED");
        }

        public async Task<bool> HasPendingRequestAsync(long followerId, long followingId)
        {
            return await _context.Follows.AnyAsync(f => f.FollowerId == followerId && f.FollowingId == followingId && f.Status == "PENDING");
        }

        public async Task<List<User>> GetFollowingAsync(long userId)
        {
            return await _context.Follows
                .Where(f => f.FollowerId == userId && f.Status == "ACCEPTED")
                .Select(f => f.Following)
                .ToListAsync();
        }

        public async Task<List<User>> GetFollowersAsync(long userId)
        {
            return await _context.Follows
                .Where(f => f.FollowingId == userId && f.Status == "ACCEPTED")
                .Select(f => f.Follower)
                .ToListAsync();
        }

        public async Task<List<User>> GetPendingRequestsAsync(long userId)
        {
            return await _context.Set<Follow>()
                .Where(f => f.FollowingId == userId && f.Status == "PENDING")
                .Select(f => f.Follower)
                .ToListAsync();
        }

        public async Task<List<User>> GetSuggestionsAsync(long userId, int limit = 5)
        {
            try
            {
                var query = _context.Users
                    .Where(u => u.Id != userId);
                
                var count = await query.CountAsync();
                Console.WriteLine($"[DEBUG] GetSuggestions: Potential candidates excluding me: {count}");

                var result = await query.Take(limit).ToListAsync();
                Console.WriteLine($"[DEBUG] GetSuggestions: Returning {result.Count} users.");
                
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] GetSuggestionsAsync: {ex.Message}");
                return new List<User>();
            }
        }

        public async Task<List<User>> GetAllConnectionsAsync(long userId)
        {
            try
            {
                // 1. Get IDs where I am the Follower
                var followingIds = await _context.Set<Follow>()
                    .Where(f => f.FollowerId == userId && f.Status == "ACCEPTED")
                    .Select(f => f.FollowingId)
                    .ToListAsync();

                // 2. Get IDs where I am the Following
                var followerIds = await _context.Set<Follow>()
                    .Where(f => f.FollowingId == userId && f.Status == "ACCEPTED")
                    .Select(f => f.FollowerId)
                    .ToListAsync();

                // 3. Combine unique IDs
                var connectedUserIds = followingIds.Concat(followerIds).Distinct().ToList();

                Console.WriteLine($"[DEBUG] GetAllConnections: Found {connectedUserIds.Count} IDs for User {userId}");

                if (!connectedUserIds.Any()) return new List<User>();

                // 4. Fetch User objects
                return await _context.Users
                    .AsNoTracking()
                    .Where(u => connectedUserIds.Contains(u.Id))
                    .ToListAsync();
            }
            catch(Exception ex)
            {
                Console.WriteLine($"[ERROR] GetAllConnectionsAsync: {ex.Message}");
                return new List<User>(); // Return empty on error to avoid 500
            }
        }

        public async Task<List<User>> SearchUsersAsync(string query, long userId)
        {
            if (string.IsNullOrWhiteSpace(query)) return new List<User>();
            
            return await _context.Users
                .Where(u => u.Id != userId && (u.FullName.Contains(query) || u.Email.Contains(query)))
                .ToListAsync();
        }
    }
}
