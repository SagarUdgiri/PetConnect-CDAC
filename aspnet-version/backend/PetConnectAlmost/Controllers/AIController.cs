using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using PetConnectAlmost.Services;
using PetConnectAlmost.DTOs;

namespace PetConnectAlmost.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api")]
    public class AIController : ControllerBase
    {
        private readonly IAIService _aiService;

        public AIController(IAIService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("ai/advice")]
        public async Task<IActionResult> GetAIAdvice(IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest("No image uploaded");

            var result = await _aiService.GetPetAdviceAsync(image);
            return Ok(JsonSerializer.Deserialize<object>(result));
        }

        [HttpPost("ai/diet-product")]
        public async Task<IActionResult> GetAIDietAndProductResponse([FromBody] PetDietRequestDto dietRequestDto)
        {
            var result = await _aiService.GetDietAndProductAsync(dietRequestDto);
            return Ok(JsonSerializer.Deserialize<object>(result));
        }
    }
}
