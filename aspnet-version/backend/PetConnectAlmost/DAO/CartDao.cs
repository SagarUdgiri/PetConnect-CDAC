using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.Data;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public class CartDao : ICartDao
    {
        private readonly ApplicationDbContext _context;
        public CartDao(ApplicationDbContext context) => _context = context;

        public async Task<CartItem?> GetCartItemAsync(long userId, long productId)
        {
            return await _context.CartItems
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);
        }

        public async Task<IReadOnlyList<CartItem>> GetCartByUserAsync(long userId)
        {
            return await _context.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .ToListAsync();
        }

        public async Task AddOrUpdateAsync(CartItem item)
        {
            var existing = await GetCartItemAsync(item.UserId, item.ProductId);
            if (existing != null)
            {
                existing.Quantity += item.Quantity;
                _context.CartItems.Update(existing);
            }
            else
            {
                await _context.CartItems.AddAsync(item);
            }
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(long cartItemId)
        {
            var item = await _context.CartItems.FindAsync(cartItemId);
            if (item != null)
            {
                _context.CartItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ClearCartAsync(long userId)
        {
            var items = await _context.CartItems.Where(ci => ci.UserId == userId).ToListAsync();
            _context.CartItems.RemoveRange(items);
            await _context.SaveChangesAsync();
        }

        public async Task<CartItem?> CartExistsAsync(long userId, long cartItemId)
        {
            return await _context.CartItems.FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);
        }
    }
}
