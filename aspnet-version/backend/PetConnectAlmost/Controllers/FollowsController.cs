using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetConnectAlmost.Services;
using System.Security.Claims;
using PetConnectAlmost.DAO;

namespace PetConnectAlmost.Controllers
{
    // [Authorize]  // Temporarily commented out for testing
    [ApiController]
    [Route("api/[controller]")]
    public class FollowsController : ControllerBase
    {
        private readonly IFollowService _followService;
        private readonly IFollowDao _followDao;

        public FollowsController(IFollowService followService, IFollowDao followDao)
        {
            _followService = followService;
            _followDao = followDao;
        }

        [Authorize]
        [HttpPost("follow/{followingId}")]
        public async Task<IActionResult> FollowUser(long followingId)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            long followerId = long.Parse(userIdClaim.Value);

            var result = await _followService.FollowUserAsync(followerId, followingId);
            return Ok(new { success = result });
        }


        [Authorize]
        [HttpPost("accept-request/{followerId}")]
        public async Task<IActionResult> AcceptRequest(long followerId)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            long followingId = long.Parse(userIdClaim.Value); // The person accepting (target)

            var result = await _followService.AcceptRequestAsync(followerId, followingId);
            return Ok(new { success = result });
        }

        [Authorize]
        [HttpPost("unfollow/{followingId}")]
        public async Task<IActionResult> UnfollowUser(long followingId)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            long followerId = long.Parse(userIdClaim.Value);

            var result = await _followService.UnfollowUserAsync(followerId, followingId);
            return Ok(new { success = result });
        }

        [Authorize]
        [HttpGet("is-following/{followingId}")]
        public async Task<IActionResult> IsFollowing(long followingId)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            long followerId = long.Parse(userIdClaim.Value);

            // Fetch actual status from service. Assuming service now returns the status string or we map it here.
            // For now, let's map the boolean to ACCEPTED or NONE as a stopgap, 
            // but ideally the service/DAO should provide the state.
            // Let's check the service first.
            var status = await _followService.GetFollowStatusAsync(followerId, followingId);
            return Ok(new { status });
        }

        [Authorize]
        [HttpGet("suggestions")]
        public async Task<IActionResult> GetSuggestions()
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            long userId = long.Parse(userIdClaim.Value);

            var suggestions = await _followService.GetSuggestionsAsync(userId);
            return Ok(suggestions);
        }

        [Authorize]
        [HttpGet("connections")]
        public async Task<IActionResult> GetConnections()
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            long userId = long.Parse(userIdClaim.Value);
            Console.WriteLine($"[DEBUG] Fetching connections for UserID: {userId}");

            var connections = await _followDao.GetAllConnectionsAsync(userId);
            Console.WriteLine($"[DEBUG] Found {connections.Count} connections for UserID: {userId}");
            foreach(var c in connections)
            {
                Console.WriteLine($"[DEBUG] Connected to: {c.FullName} ({c.Id})");
            }
            
            return Ok(connections);
        }

        [Authorize]
        [HttpGet("pending-requests")]
        public async Task<IActionResult> GetPendingRequests()
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            long userId = long.Parse(userIdClaim.Value);
            var requests = await _followDao.GetPendingRequestsAsync(userId);
            return Ok(requests);
        }

        [Authorize]
        [HttpPost("cancel-request/{followingId}")]
        public async Task<IActionResult> CancelRequest(long followingId)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            long followerId = long.Parse(userIdClaim.Value);
            var result = await _followService.UnfollowUserAsync(followerId, followingId);
            return Ok(new { success = result });
        }

        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            var results = await _followService.SearchUsersAsync(q, userId);
            return Ok(results);
        }
    }
}
