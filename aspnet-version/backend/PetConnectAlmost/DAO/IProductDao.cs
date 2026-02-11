using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public interface IProductDao
    {
        Task<IReadOnlyList<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(long id);
        Task AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(long id);
        Task<bool> NameExistsInCategoryAsync(string name, string category); // Change to string category base to match model

        Task DeductStockAsync(IEnumerable<CartItem> cartItems);
    }
}
