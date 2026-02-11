using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public interface IFollowDao
    {
        Task<bool> FollowUserAsync(long followerId, long followingId); // Sends request
        Task<bool> AcceptFollowRequestAsync(long followerId, long followingId);
        Task<bool> UnfollowUserAsync(long followerId, long followingId);
        Task<bool> IsFollowingAsync(long followerId, long followingId); // Checks for ACCEPTED
        Task<bool> HasPendingRequestAsync(long followerId, long followingId);
        Task<List<User>> GetFollowingAsync(long userId); // Only ACCEPTED
        Task<List<User>> GetFollowersAsync(long userId); // Only ACCEPTED
        Task<List<User>> GetPendingRequestsAsync(long userId);
        Task<List<User>> GetSuggestionsAsync(long userId, int limit = 5);
        Task<List<User>> GetAllConnectionsAsync(long userId);
        Task<List<User>> SearchUsersAsync(string query, long userId);
    }
}
