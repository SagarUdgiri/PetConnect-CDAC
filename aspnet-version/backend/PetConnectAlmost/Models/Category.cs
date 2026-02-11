using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetConnectAlmost.Models
{
    [Table("categories")]
    public class Category
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required, StringLength(50)]
        [Column("name")]
        public string Name { get; set; } = null!;
        
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
