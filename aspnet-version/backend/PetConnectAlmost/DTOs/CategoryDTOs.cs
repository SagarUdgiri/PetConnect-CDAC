namespace PetConnectAlmost.DTOs
{
    public class CategoryDto
    {
        public long CategoryId { get; set; }
        public string Name { get; set; } = null!;
    }

    public class CreateCategoryRequest
    {
        public string Name { get; set; } = null!;
    }

    public class UpdateCategoryRequest
    {
        public string? Name { get; set; }
    }
}