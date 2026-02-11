using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetConnectAlmost.Services;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Controllers
{
    
    [ApiController]
    [Route("api/admin-users")]
    public class AdminUserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IOrderService _orderService;

        public AdminUserController(IUserService userService, IOrderService orderService)
        {
            _userService = userService;
            _orderService = orderService;
        }

        [HttpGet("ping")]
        public IActionResult Ping() => Ok("Admin Users API is reachable!");

        [HttpGet("debug-auth")]
        public IActionResult GetClaims()
        {
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return Ok(new { 
                IsAuthenticated = User.Identity?.IsAuthenticated,
                Name = User.Identity?.Name,
                Claims = claims,
                Roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).Union(User.FindAll("role").Select(c => c.Value)).ToList()
            });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _userService.GetSystemStatsAsync();
            return Ok(stats);
        }

        [HttpGet("all-orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpPut("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(long id, [FromBody] UpdateOrderStatusRequest request)
        {
            var result = await _orderService.UpdateOrderStatusAsync(id, request.Status);
            return result is ErrorResponse err ? StatusCode(err.StatusCode, err) : Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("u/{id}")]
        public async Task<IActionResult> GetUserById(long id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });
            return Ok(user);
        }

        [HttpDelete("u/{id}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            var deleted = await _userService.DeleteUserAsync(id);
            if (!deleted) return NotFound(new { message = "User not found" });
            return Ok(new { message = "User deleted successfully" });
        }
    }

    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; } = null!;
    }
}
