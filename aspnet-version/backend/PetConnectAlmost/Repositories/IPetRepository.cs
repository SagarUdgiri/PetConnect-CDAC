using PetConnectAlmost.Models;

namespace PetConnectAlmost.Repositories
{
    public interface IPetRepository
    {
        Task<IEnumerable<Pet>> GetAllAsync();
        Task<Pet?> GetByIdAsync(long id);
        Task<IEnumerable<Pet>> GetByUserIdAsync(long userId);
        Task<Pet> AddAsync(Pet pet);
        Task UpdateAsync(Pet pet);
        Task DeleteAsync(long id);
    }
}
