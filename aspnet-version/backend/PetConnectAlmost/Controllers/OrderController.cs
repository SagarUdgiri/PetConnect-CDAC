using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetConnectAlmost.Models;
using PetConnectAlmost.Services;
using System.Security.Claims;

namespace PetConnectAlmost.Controllers
{
    [ApiController]
    [Route("api/Orders")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;
        private long UserId => long.Parse(User.FindFirst("sub")?.Value 
                                         ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                         ?? "0");

        public OrderController(IOrderService service) => _service = service;

        [HttpGet("my-orders")] 
        public async Task<IActionResult> GetMyOrders() => Ok(await _service.GetUserOrdersAsync(UserId));
        
        [HttpGet("{orderId}")]
        public async Task<IActionResult> Get(long orderId)
        {
            var result = await _service.GetOrderDetailsAsync(UserId, orderId);
            return result is ErrorResponse err ? StatusCode(err.StatusCode, err) : Ok(result);
        }
        
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromQuery] string? transactionId = null)
        {
            var result = await _service.CheckoutAsync(UserId, transactionId);
            return result is ErrorResponse err ? StatusCode(err.StatusCode, err) : Ok(result);
        }
    }

    public class MockPaymentRequest
    {
        public string? TransactionId { get; set; }
    }
}
