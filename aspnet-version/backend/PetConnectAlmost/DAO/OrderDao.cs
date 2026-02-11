using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.Data;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public class OrderDao : IOrderDao
    {
        private readonly ApplicationDbContext _context;
        public OrderDao(ApplicationDbContext context) => _context = context;

        public async Task<Order?> GetOrderWithDetailsAsync(long orderId, long userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersByUserAsync(long userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order> CreateOrderAsync(Order order, List<OrderItem> orderItems)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.Orders.AddAsync(order);
                await _context.SaveChangesAsync(); // To get Id

                foreach (var item in orderItems)
                {
                    item.OrderId = order.Id;
                }
                await _context.OrderItems.AddRangeAsync(orderItems);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return order;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<IReadOnlyList<Order>> GetAllOrdersWithDetailsAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(long orderId)
        {
            return await _context.Orders.FindAsync(orderId);
        }

        public async Task UpdateOrderAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }
    }
}
