using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using PetConnectAlmost.DTOs;

namespace PetConnectAlmost.Services
{
    public interface IAIService
    {
        Task<string> GetPetAdviceAsync(IFormFile image);
        Task<string> GetDietAndProductAsync(PetDietRequestDto dietRequestDto);
    }
}
