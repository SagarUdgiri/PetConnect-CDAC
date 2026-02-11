using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetConnectAlmost.Models
{
    [Table("order_items")]
    public class OrderItem
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("order_id")]
        public long OrderId { get; set; }

        [Column("product_id")]
        public long ProductId { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("price_at_purchase", TypeName = "decimal(10,2)")]
        public decimal PriceAtPurchase { get; set; }

        // Navigation
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}
