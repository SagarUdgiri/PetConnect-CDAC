using PetConnectAlmost.DTOs;

namespace PetConnectAlmost.Services
{
    public interface IProductService
    {
        Task<object> GetAllProductsAsync();
        Task<object> GetProductByIdAsync(long id);
        Task<object> CreateProductAsync(CUProductRequest request);
        Task<object> UpdateProductAsync(long id, CUProductRequest request);
        Task<object> DeleteProductAsync(long id);
    }
}
