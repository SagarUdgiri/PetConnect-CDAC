using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public interface IPetService
    {
        Task<IEnumerable<Pet>> GetAllPetsAsync();
        Task<Pet?> GetPetByIdAsync(long id);
        Task<IEnumerable<Pet>> GetByUserIdAsync(long userId);
        Task<Pet> RegisterPetAsync(PetRegisterRequest request, long userId);
        Task UpdatePetAsync(long id, PetRegisterRequest request);
        Task DeletePetAsync(long id);
    }
}
