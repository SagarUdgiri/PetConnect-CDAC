using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetConnectAlmost.Services;
using System.Security.Claims;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public UsersController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpGet("nearby-users")]
        public async Task<IActionResult> GetNearbyUsers([FromQuery] double userLat, [FromQuery] double userLong, [FromQuery] double radiusKm = 10)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            long userId = long.Parse(userIdClaim.Value);
            var users = await _authService.GetAllNearbyUsers(userId, userLat, userLong, radiusKm);
            return Ok(users);
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            long userId = long.Parse(userIdClaim.Value);
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null) return NotFound(new { message = "User not found" });

            return Ok(user);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserRequest request)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            long userId = long.Parse(userIdClaim.Value);
            var result = await _userService.UpdateUserAsync(userId, request);
            
            if (result is ErrorResponse error)
                return StatusCode(error.StatusCode, error);

            return Ok(result);
        }
    }
}
