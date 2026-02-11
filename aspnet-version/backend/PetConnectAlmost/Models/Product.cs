using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetConnectAlmost.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("description")]
        public string? Description { get; set; }

        [Column("price", TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; } = 0;

        [Column("is_available")]
        public bool IsAvailable { get; set; } = true;

        [Column("image_url")]
        public string? ImageUrl { get; set; }

        [Column("category")]
        public string Category { get; set; } = null!;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
