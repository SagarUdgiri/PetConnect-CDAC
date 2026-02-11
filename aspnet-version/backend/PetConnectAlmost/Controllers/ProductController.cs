using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;
using PetConnectAlmost.Services;

namespace PetConnectAlmost.Controllers
{
    [ApiController]
    [Route("api/shop/products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;
        public ProductController(IProductService service) => _service = service;

        [HttpGet] public async Task<IActionResult> GetAll() => Ok(await _service.GetAllProductsAsync());
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(long id)
        {
            var result = await _service.GetProductByIdAsync(id);
            return result is ErrorResponse err ? StatusCode(err.StatusCode, err) : Ok(result);
        }
        //[Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CUProductRequest req)
        {
            var result = await _service.CreateProductAsync(req);
            return result is ErrorResponse err ? StatusCode(err.StatusCode, err) : CreatedAtAction(nameof(Get), new { id = ((dynamic)result).productId }, result);
        }
        //[Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] CUProductRequest req)
        {
            var result = await _service.UpdateProductAsync(id, req);
            return result is ErrorResponse err ? StatusCode(err.StatusCode, err) : Ok(result);
        }
        //[Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var result = await _service.DeleteProductAsync(id);
            return result is ErrorResponse err ? StatusCode(err.StatusCode, err) : Ok(result);
        }
    }
}
