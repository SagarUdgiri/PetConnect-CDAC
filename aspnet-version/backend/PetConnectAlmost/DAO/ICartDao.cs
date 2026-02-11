using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public interface ICartDao
    {
        Task<CartItem?> GetCartItemAsync(long userId, long productId);
        Task<IReadOnlyList<CartItem>> GetCartByUserAsync(long userId);
        Task AddOrUpdateAsync(CartItem item);
        Task RemoveAsync(long cartItemId);
        Task ClearCartAsync(long userId);

        Task<CartItem?> CartExistsAsync(long userId, long cartItemId);
    }
}
