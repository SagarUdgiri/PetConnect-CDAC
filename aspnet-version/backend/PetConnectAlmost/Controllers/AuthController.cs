using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.Data;
using PetConnectAlmost.Models;
using PetConnectAlmost.Services;

namespace PetConnectAlmost.Controllers

{
    [ApiController]
    [Route("api/auth")]
    public class AuthController:ControllerBase
    {
        private readonly IAuthService authService;

        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpGet("ping")]
        public IActionResult Ping() => Ok("Auth API is reachable!");
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var result = await authService.RegisterAsync(request);
            if (result is ErrorResponse error && error.StatusCode >= 400)
            {
                return StatusCode(error.StatusCode, error);
            }

            return Ok(result);

        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest dto)
        {
            var result = await authService.LoginAsync(dto);
            if (result is ErrorResponse error && error.StatusCode >= 400)
            {
                return StatusCode(error.StatusCode, error);
            }

            return Ok(result);
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(OtpVerifyRequest request)
        {
            var result = await authService.VerifyOtpAsync(request);
            if (result is ErrorResponse error && error.StatusCode >= 400)
            {
                return StatusCode(error.StatusCode, error);
            }

            return Ok(result);
        }

    }
}
