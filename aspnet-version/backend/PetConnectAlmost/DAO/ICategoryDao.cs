using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public interface ICategoryDao
    {
        Task<IReadOnlyList<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(long id);
        Task<Category?> GetByNameAsync(string name);
        Task AddAsync(Category category);
        Task UpdateAsync(Category category);
        Task DeleteAsync(long id);
        Task<bool> ExistsByNameAsync(string name, long? excludeId = null);
    }
}
