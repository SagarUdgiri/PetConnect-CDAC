using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;
using PetConnectAlmost.Services;
using System.Security.Claims;

namespace PetConnectAlmost.Controllers
{
    [ApiController]
    [Route("api/cart")]
    [Authorize] 
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;
        private long UserId => long.Parse(User.FindFirst("sub")?.Value 
                                         ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                         ?? "0");

        public CartController(ICartService service) => _service = service;

        [HttpGet("my-cart")] public async Task<IActionResult> Get() => Ok(await _service.GetCartAsync(UserId));
        
        [HttpPost("add")]
        public async Task<IActionResult> Add([FromQuery] long productId, [FromQuery] int quantity = 1)
        {
            var req = new AddToCartRequest { ProductId = productId, Quantity = quantity };
            var result = await _service.AddToCartAsync(UserId, req);
            return result is ErrorResponse err ? StatusCode(err.StatusCode, err) : Ok(result);
        }

        [HttpDelete("remove/{cartItemId}")]
        public async Task<IActionResult> Remove(long cartItemId)
        {
            var result = await _service.RemoveFromCartAsync(UserId, cartItemId);
            return result is ErrorResponse err ? StatusCode(err.StatusCode, err) : Ok(result);
        }
        [HttpDelete("clear")] public async Task<IActionResult> Clear() => Ok(await _service.ClearCartAsync(UserId));
    }
}
