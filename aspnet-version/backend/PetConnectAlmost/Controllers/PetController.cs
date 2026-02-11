using Microsoft.AspNetCore.Mvc;
using PetConnectAlmost.Models;
using PetConnectAlmost.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace PetConnectAlmost.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PetController : ControllerBase
    {
        private readonly IPetService _petService;

        public PetController(IPetService petService)
        {
            _petService = petService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllPets()
        {
            var pets = await _petService.GetAllPetsAsync();
            return Ok(pets);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPetById(long id)
        {
            var pet = await _petService.GetPetByIdAsync(id);
            if (pet == null)
                return NotFound("Pet not found");
            return Ok(pet);
        }

        [AllowAnonymous]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPetsByUserId(long userId)
        {
            var pets = await _petService.GetByUserIdAsync(userId);
            return Ok(pets);
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterPet(PetRegisterRequest request)
        {
            Console.WriteLine($"Registering Pet: {request.PetName}, Age: {request.Age}");
            // Try to get sub or NameIdentifier
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized(new { message = "Session expired or invalid token. Please log in again." });

            if (!long.TryParse(userIdClaim.Value, out long userId))
                return BadRequest(new { message = "Invalid user identifier in token." });

            var pet = await _petService.RegisterPetAsync(request, userId);

            return Ok(new
            {
                message = "Pet registered successfully",
                petId = pet.Id
            });
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePet(long id, PetRegisterRequest request)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            var pet = await _petService.GetPetByIdAsync(id);
            if (pet == null) return NotFound("Pet not found");
            if (pet.UserId != userId) return Forbid();

            Console.WriteLine($"Updating Pet ID {id}: {request.PetName}, Age: {request.Age}");
            try
            {
                await _petService.UpdatePetAsync(id, request);
                return Ok(new { message = "Pet updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePet(long id)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            var pet = await _petService.GetPetByIdAsync(id);
            if (pet == null) return NotFound("Pet not found");
            if (pet.UserId != userId) return Forbid();

            await _petService.DeletePetAsync(id);
            return Ok(new { message = "Pet deleted successfully" });
        }
    }
}
