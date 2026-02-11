using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetConnectAlmost.Services;

namespace PetConnectAlmost.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/Notifications")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized(new { message = "User identifier not found in token" });
            long userId = long.Parse(userIdClaim.Value);

            var notifications = await _notificationService.GetNotificationsAsync((int)userId);
            return Ok(notifications);
        }

        [HttpPost("mark-read/{notificationId}")]
        public async Task<IActionResult> MarkAsRead(int notificationId)
        {
            await _notificationService.MarkAsReadAsync(notificationId);
            return Ok();
        }

        [HttpPost("mark-all-read")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            await _notificationService.MarkAllAsReadAsync((int)userId);
            return Ok();
        }
    }
}
