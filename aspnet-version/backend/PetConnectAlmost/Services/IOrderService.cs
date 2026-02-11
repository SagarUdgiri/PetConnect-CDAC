namespace PetConnectAlmost.Services
{
    public interface IOrderService
    {
        Task<object> GetUserOrdersAsync(long userId);
        Task<object> GetOrderDetailsAsync(long userId, long orderId);
        Task<object> CheckoutAsync(long userId, string? transactionId = null);
        Task<object> GetAllOrdersAsync();
        Task<object> UpdateOrderStatusAsync(long orderId, string status);
    }
}
