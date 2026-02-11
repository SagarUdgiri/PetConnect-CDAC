using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Services;

namespace PetConnectAlmost.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/missing-pets")]
    public class MissingPetController : ControllerBase
    {
        private readonly IMissingPetService _missingPetService;

        public MissingPetController(IMissingPetService missingPetService)
        {
            _missingPetService = missingPetService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReport([FromBody] MissingPetRequest request)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            var result = await _missingPetService.CreateReportAsync(userId, request);
            return Ok(result);
        }

        [HttpGet("nearby")]
        public async Task<IActionResult> GetNearbyReports([FromQuery] double radius = 10.0)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            var result = await _missingPetService.GetNearbyReportsAsync(userId, radius);
            return Ok(result);
        }

        [HttpGet("my-reports")]
        public async Task<IActionResult> GetMyReports()
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            var result = await _missingPetService.GetMyReportsAsync(userId);
            return Ok(result);
        }

        [HttpPost("{reportId}/contact")]
        public async Task<IActionResult> ContactReporter(long reportId, [FromBody] ContactRequest request)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);
            
            var result = await _missingPetService.ContactReporterAsync(reportId, userId, request.Message);
            return Ok(new { message = result });
        }

        [HttpGet("{reportId}/contacts")]
        public async Task<IActionResult> GetContacts(long reportId)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            var result = await _missingPetService.GetContactsForReportAsync(reportId, userId);
            return Ok(result);
        }

        [HttpDelete("{reportId}")]
        public async Task<IActionResult> DeleteReport(long reportId)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            try
            {
                var result = await _missingPetService.DeleteReportAsync(reportId, userId);
                return Ok(new { message = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
