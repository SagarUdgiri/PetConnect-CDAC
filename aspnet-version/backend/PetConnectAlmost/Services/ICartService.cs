using PetConnectAlmost.DTOs;

namespace PetConnectAlmost.Services
{
    public interface ICartService
    {
        Task<object> GetCartAsync(long userId);
        Task<object> AddToCartAsync(long userId, AddToCartRequest request);
        Task<object> RemoveFromCartAsync(long userId, long cartItemId);
        Task<object> ClearCartAsync(long userId);
    }
}
