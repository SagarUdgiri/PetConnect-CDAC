using PetConnectAlmost.DTOs;

namespace PetConnectAlmost.Services
{
    public interface ICategoryService
    {
        Task<object> GetAllAsync();
        Task<object> GetByIdAsync(long id);
        Task<object> CreateAsync(CreateCategoryRequest request);
        Task<object> UpdateAsync(long id, UpdateCategoryRequest request);
        Task<object> DeleteAsync(long id);
    }
}