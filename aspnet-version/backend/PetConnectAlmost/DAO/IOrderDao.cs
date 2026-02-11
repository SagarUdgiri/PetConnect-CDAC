using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public interface IOrderDao
    {
        Task<Order?> GetOrderWithDetailsAsync(long orderId, long userId);
        Task<IReadOnlyList<Order>> GetOrdersByUserAsync(long userId);
        Task<Order> CreateOrderAsync(Order order, List<OrderItem> orderItems);
        Task<IReadOnlyList<Order>> GetAllOrdersWithDetailsAsync();
        Task<Order?> GetOrderByIdAsync(long orderId);
        Task UpdateOrderAsync(Order order);
    }
}
