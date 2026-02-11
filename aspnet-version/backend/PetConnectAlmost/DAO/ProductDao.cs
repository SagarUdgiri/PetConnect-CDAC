using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.Data;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public class ProductDao : IProductDao
    {
        private readonly ApplicationDbContext _context;
        public ProductDao(ApplicationDbContext context) => _context = context;

        public async Task<IReadOnlyList<Product>> GetAllAsync()
        {
            return await _context.Products
                .AsNoTracking()
                .OrderBy(p => p.Name)
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(long id)
        {
            return await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(long id)
        {
            var product = await GetByIdAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> NameExistsInCategoryAsync(string name, string category)
        {
            return await _context.Products.AnyAsync(p => p.Name == name && p.Category == category);
        }

        public async Task DeductStockAsync(IEnumerable<CartItem> cartItems)
        {
            foreach (var item in cartItems)
            {
                item.Product.Quantity -= item.Quantity;
                item.Product.IsAvailable = item.Product.Quantity > 0;
            }

            await _context.SaveChangesAsync();
        }
    }
}
