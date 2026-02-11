using PetConnectAlmost.DAO;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryDao _categoryDao;

        public CategoryService(ICategoryDao categoryDao)
        {
            _categoryDao = categoryDao;
        }

        public async Task<object> GetAllAsync()
        {
            var categories = await _categoryDao.GetAllAsync();
            var dtos = categories.Select(c => new CategoryDto
            {
                CategoryId = c.Id,
                Name = c.Name
            }).ToList();

            return new { success = true, data = dtos };
        }

        public async Task<object> GetByIdAsync(long id)
        {
            var category = await _categoryDao.GetByIdAsync(id);
            if (category == null)
            {
                return new ErrorResponse
                {
                    Message = "Category not found",
                    Error = "NotFound",
                    StatusCode = 404
                };
            }

            var dto = new CategoryDto
            {
                CategoryId = category.Id,
                Name = category.Name
            };

            return new { success = true, data = dto };
        }

        public async Task<object> CreateAsync(CreateCategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return new ErrorResponse
                {
                    Message = "Category name is required",
                    Error = "InvalidName",
                    StatusCode = 400
                };
            }

            if (await _categoryDao.ExistsByNameAsync(request.Name))
            {
                return new ErrorResponse
                {
                    Message = "Category name already exists",
                    Error = "DuplicateName",
                    StatusCode = 409
                };
            }

            var category = new Category
            {
                Name = request.Name.Trim()
            };

            await _categoryDao.AddAsync(category);

            return new
            {
                success = true,
                message = "Category created successfully",
                data = new CategoryDto
                {
                    CategoryId = category.Id,
                    Name = category.Name
                }
            };
        }

        public async Task<object> UpdateAsync(long id, UpdateCategoryRequest request)
        {
            var category = await _categoryDao.GetByIdAsync(id);
            if (category == null)
            {
                return new ErrorResponse
                {
                    Message = "Category not found",
                    Error = "NotFound",
                    StatusCode = 404
                };
            }

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                var newName = request.Name.Trim();
                if (newName != category.Name &&
                    await _categoryDao.ExistsByNameAsync(newName, category.Id))
                {
                    return new ErrorResponse
                    {
                        Message = "Category name already exists",
                        Error = "DuplicateName",
                        StatusCode = 409
                    };
                }
                category.Name = newName;
            }

            await _categoryDao.UpdateAsync(category);

            return new
            {
                success = true,
                message = "Category updated successfully",
                data = new CategoryDto
                {
                    CategoryId = category.Id,
                    Name = category.Name
                }
            };
        }

        public async Task<object> DeleteAsync(long id)
        {
            var category = await _categoryDao.GetByIdAsync(id);
            if (category == null)
            {
                return new ErrorResponse
                {
                    Message = "Category not found",
                    Error = "NotFound",
                    StatusCode = 404
                };
            }

            await _categoryDao.DeleteAsync(id);
            return new { success = true, message = "Category deleted successfully" };
        }
    }
}