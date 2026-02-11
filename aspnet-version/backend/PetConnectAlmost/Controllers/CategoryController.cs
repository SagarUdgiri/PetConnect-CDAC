using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;
using PetConnectAlmost.Services;

namespace PetConnectAlmost.Controllers
{
    [ApiController]
    [Route("api/shop/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var result = await _categoryService.GetByIdAsync(id);
            if (result is ErrorResponse error)
                return StatusCode(error.StatusCode, error);
            return Ok(result);
        }

        //[Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
        {
            var result = await _categoryService.CreateAsync(request);
            if (result is ErrorResponse error)
                return StatusCode(error.StatusCode, error);
            return Ok(result);
        }

        //[Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateCategoryRequest request)
        {
            var result = await _categoryService.UpdateAsync(id, request);
            if (result is ErrorResponse error)
                return StatusCode(error.StatusCode, error);
            return Ok(result);
        }

        //[Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var result = await _categoryService.DeleteAsync(id);
            if (result is ErrorResponse error)
                return StatusCode(error.StatusCode, error);
            return Ok(result);
        }
    }
}