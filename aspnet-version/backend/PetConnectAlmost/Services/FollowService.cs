using PetConnectAlmost.DAO;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public class FollowService : IFollowService
    {
        private readonly IFollowDao _followDao;
        private readonly INotificationService _notificationService;
        private readonly IUserService _userService;

        public FollowService(IFollowDao followDao, INotificationService notificationService, IUserService userService)
        {
            _followDao = followDao;
            _notificationService = notificationService;
            _userService = userService;
        }

        public async Task<bool> FollowUserAsync(long followerId, long followingId)
        {
            var result = await _followDao.FollowUserAsync(followerId, followingId);
            if (result)
            {
                var follower = await _userService.GetUserEntityByIdAsync(followerId);
                if (follower != null)
                {
                    await _notificationService.CreateNotificationAsync(
                        followingId,
                        "CONNECTION_REQUEST",
                        $"{follower.FullName} wants to connect with you.",
                        null,
                        followerId
                    );
                }
            }
            return result;
        }

        public async Task<bool> AcceptRequestAsync(long followerId, long followingId)
        {
            var result = await _followDao.AcceptFollowRequestAsync(followerId, followingId);
            if (result)
            {
                var acceptor = await _userService.GetUserEntityByIdAsync(followingId);
                if (acceptor != null)
                {
                    await _notificationService.CreateNotificationAsync(
                        followerId,
                        "CONNECTION_ACCEPTED",
                        $"{acceptor.FullName} accepted your connection request.",
                        null,
                        followingId
                    );
                }
            }
            return result;
        }

        public async Task<bool> UnfollowUserAsync(long followerId, long followingId)
        {
            return await _followDao.UnfollowUserAsync(followerId, followingId);
        }

        public async Task<bool> IsFollowingAsync(long followerId, long followingId)
        {
            return await _followDao.IsFollowingAsync(followerId, followingId);
        }

        public async Task<List<User>> GetSuggestionsAsync(long userId, int limit = 5)
        {
            return await _followDao.GetSuggestionsAsync(userId, limit);
        }

        public async Task<string> GetFollowStatusAsync(long followerId, long followingId)
        {
            if (await _followDao.IsFollowingAsync(followerId, followingId))
                return "ACCEPTED";
            
            if (await _followDao.HasPendingRequestAsync(followerId, followingId))
                return "PENDING";
            
            if (await _followDao.HasPendingRequestAsync(followingId, followerId))
                return "INCOMING";
            
            return "NONE";
        }

        public async Task<List<User>> SearchUsersAsync(string query, long userId)
        {
            // Simple search implementation
            return await _followDao.SearchUsersAsync(query, userId); 
        }
    }
}
