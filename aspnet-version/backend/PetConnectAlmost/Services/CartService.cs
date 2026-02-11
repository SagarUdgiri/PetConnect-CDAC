using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.DAO;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public class CartService : ICartService
    {
        private readonly ICartDao _cartDao;
        private readonly IProductDao _productDao;

        public CartService(ICartDao cartDao, IProductDao productDao)
        {
            _cartDao = cartDao;
            _productDao = productDao;
        }

        public async Task<object> GetCartAsync(long userId)
        {
            var items = await _cartDao.GetCartByUserAsync(userId);
            var dto = new CartResponseDto
            {
                Items = items.Select(i => new CartItemDto
                {
                    CartItemId = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Price = i.Product.Price,
                    ImageUrl = i.Product.ImageUrl,
                    Quantity = i.Quantity
                }).ToList()
            };
            return dto;
        }

        public async Task<object> AddToCartAsync(long userId, AddToCartRequest request)
        {
            var product = await _productDao.GetByIdAsync(request.ProductId);
            if (product == null)
                return new ErrorResponse { Message = "Product not found", Error = "NotFound", StatusCode = 404 };

            if (!product.IsAvailable || product.Quantity < request.Quantity)
                return new ErrorResponse { Message = "Insufficient stock", Error = "OutOfStock", StatusCode = 400 };

            var cartItem = new CartItem
            {
                UserId = userId,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                CreatedAt = DateTime.UtcNow
            };

            await _cartDao.AddOrUpdateAsync(cartItem);
            return await GetCartAsync(userId);
        }

        public async Task<object> RemoveFromCartAsync(long userId, long cartItemId)
        {
            var existing = await _cartDao.CartExistsAsync(userId, cartItemId);
            if (existing == null)
                return new ErrorResponse { Message = "Cart item not found", Error = "NotFound", StatusCode = 404 };

            await _cartDao.RemoveAsync(cartItemId);
            return await GetCartAsync(userId);
        }

        public async Task<object> ClearCartAsync(long userId)
        {
            await _cartDao.ClearCartAsync(userId);
            return new CartResponseDto();
        }
    }
}
