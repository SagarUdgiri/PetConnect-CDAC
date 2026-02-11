using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public interface IFollowService
    {
        Task<bool> FollowUserAsync(long followerId, long followingId);
        Task<bool> AcceptRequestAsync(long followerId, long followingId);
        Task<bool> UnfollowUserAsync(long followerId, long followingId);
        Task<bool> IsFollowingAsync(long followerId, long followingId);
        Task<List<User>> GetSuggestionsAsync(long userId, int limit = 5);
        Task<string> GetFollowStatusAsync(long followerId, long followingId);
        Task<List<User>> SearchUsersAsync(string query, long userId);
    }
}
