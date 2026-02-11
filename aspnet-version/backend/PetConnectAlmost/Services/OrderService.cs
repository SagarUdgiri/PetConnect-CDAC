using PetConnectAlmost.DAO;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderDao _orderDao;
        private readonly ICartDao _cartDao;
        private readonly IProductDao _productDao;

        public OrderService(IOrderDao orderDao, ICartDao cartDao, IProductDao productDao)
        {
            _orderDao = orderDao;
            _cartDao = cartDao;
            _productDao = productDao;
        }

        public async Task<object> GetUserOrdersAsync(long userId)
        {
            var orders = await _orderDao.GetOrdersByUserAsync(userId);
            return orders.Select(o => new OrderSummaryDto
            {
                OrderId = o.Id,
                TotalPrice = o.TotalPrice,
                OrderStatus = o.Status.ToString(),
                CreatedAt = o.CreatedAt,
                ItemsCount = o.OrderItems.Count
            }).ToList();
        }

        public async Task<object> GetOrderDetailsAsync(long userId, long orderId)
        {
            var order = await _orderDao.GetOrderWithDetailsAsync(orderId, userId);
            if (order == null)
                return new ErrorResponse { Message = "Order not found", Error = "NotFound", StatusCode = 404 };

            return new OrderDetailsDto
            {
                OrderId = order.Id,
                TotalPrice = order.TotalPrice,
                OrderStatus = order.Status.ToString(),
                TransactionId = order.TransactionId,
                CreatedAt = order.CreatedAt,
                Items = order.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    ImageUrl = oi.Product.ImageUrl,
                    Quantity = oi.Quantity,
                    PriceAtPurchase = oi.PriceAtPurchase
                }).ToList()
            };
        }

        public async Task<object> CheckoutAsync(long userId, string? transactionId = null)
        {
            var cartItems = await _cartDao.GetCartByUserAsync(userId);
            if (!cartItems.Any())
                return new ErrorResponse { Message = "Cart is empty", Error = "EmptyCart", StatusCode = 400 };

            decimal total = 0;
            var orderItems = new List<OrderItem>();

            foreach (var item in cartItems)
            {
                var product = item.Product;

                if (product.Quantity < item.Quantity)
                    return new ErrorResponse
                    {
                        Message = $"Insufficient stock for {product.Name}",
                        Error = "OutOfStock",
                        StatusCode = 400
                    };

                total += product.Price * item.Quantity;

                orderItems.Add(new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    PriceAtPurchase = product.Price
                });
            }

            await _productDao.DeductStockAsync(cartItems);

            var order = new Order
            {
                UserId = userId,
                TotalPrice = total,
                Status = string.IsNullOrEmpty(transactionId) ? "PENDING" : "PAID",
                TransactionId = transactionId,
                CreatedAt = DateTime.UtcNow
            };

            await _orderDao.CreateOrderAsync(order, orderItems);

            await _cartDao.ClearCartAsync(userId);

            return new
            {
                message = "Order placed successfully",
                orderId = order.Id,
                totalPrice = total,
                status = order.Status
            };
        }

        public async Task<object> GetAllOrdersAsync()
        {
            var orders = await _orderDao.GetAllOrdersWithDetailsAsync();
            return orders.Select(o => new
            {
                orderId = o.Id,
                userId = o.UserId,
                username = o.User.Username,
                userEmail = o.User.Email,
                totalPrice = o.TotalPrice,
                orderStatus = o.Status,
                transactionId = o.TransactionId,
                createdAt = o.CreatedAt,
                items = o.OrderItems.Select(oi => new
                {
                    productId = oi.ProductId,
                    productName = oi.Product.Name,
                    quantity = oi.Quantity,
                    priceAtPurchase = oi.PriceAtPurchase
                }).ToList()
            }).ToList();
        }

        public async Task<object> UpdateOrderStatusAsync(long orderId, string status)
        {
            var order = await _orderDao.GetOrderByIdAsync(orderId);
            if (order == null)
                return new ErrorResponse { Message = "Order not found", Error = "NotFound", StatusCode = 404 };

            order.Status = status.ToUpper();
            await _orderDao.UpdateOrderAsync(order);
            return new { message = "Order status updated successfully", status = order.Status };
        }
    }
}
