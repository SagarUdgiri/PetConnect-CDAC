using PetConnectAlmost.DAO;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductDao _productDao;
        private readonly ICategoryDao _categoryDao;

        public ProductService(IProductDao productDao, ICategoryDao categoryDao)
        {
            _productDao = productDao;
            _categoryDao = categoryDao;
        }

        public async Task<object> GetAllProductsAsync()
        {
            var products = await _productDao.GetAllAsync();
            return products.Select(p => new ProductDto
            {
                ProductId = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Quantity = p.Quantity,
                IsAvailable = p.IsAvailable,
                ImageUrl = p.ImageUrl,
                Category = p.Category
            }).ToList();
        }

        public async Task<object> GetProductByIdAsync(long id)
        {
            var product = await _productDao.GetByIdAsync(id);
            if (product == null)
                return new ErrorResponse { Message = "Product not found", Error = "NotFound", StatusCode = 404 };

            return new ProductDto
            {
                ProductId = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                IsAvailable = product.IsAvailable,
                ImageUrl = product.ImageUrl,
                Category = product.Category
            };
        }

        public async Task<object> CreateProductAsync(CUProductRequest request)
        {
            if (await _productDao.NameExistsInCategoryAsync(request.Name, request.Category))
                return new ErrorResponse { Message = "Product with this name already exists in category", Error = "DuplicateName", StatusCode = 409 };

            var product = new Product
            {
                Name = request.Name.Trim(),
                Description = request.Description?.Trim(),
                Price = request.Price,
                Quantity = request.Quantity,
                IsAvailable = request.Quantity > 0,
                ImageUrl = request.ImageUrl,
                Category = request.Category,
                CreatedAt = DateTime.UtcNow
            };

            await _productDao.AddAsync(product);

            return new { message = "Product created successfully", productId = product.Id };
        }

        public async Task<object> UpdateProductAsync(long id, CUProductRequest request)
        {
            var product = await _productDao.GetByIdAsync(id);
            if (product == null)
                return new ErrorResponse { Message = "Product not found", Error = "NotFound", StatusCode = 404 };

            product.Name = request.Name.Trim();
            product.Description = request.Description?.Trim();
            product.Price = request.Price;
            product.Quantity = request.Quantity;
            product.IsAvailable = request.Quantity > 0;
            product.ImageUrl = request.ImageUrl;
            product.Category = request.Category;

            await _productDao.UpdateAsync(product);
            return new { message = "Product updated successfully" };
        }

        public async Task<object> DeleteProductAsync(long id)
        {
            var product = await _productDao.GetByIdAsync(id);
            if (product == null)
                return new ErrorResponse { Message = "Product not found", Error = "NotFound", StatusCode = 404 };

            await _productDao.DeleteAsync(id);
            return new { message = "Product deleted successfully" };
        }
    }
}
