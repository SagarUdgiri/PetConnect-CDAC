using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetConnectAlmost.Models
{
    [Table("orders")]
    public class Order
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("user_id")]
        public long UserId { get; set; }

        [Column("total_price", TypeName = "decimal(10,2)")]
        public decimal TotalPrice { get; set; }

        [Column("status")]
        public string Status { get; set; } = "PENDING"; // PENDING, PAID, COMPLETED, CANCELLED

        [Column("transaction_id")]
        [StringLength(100)]
        public string? TransactionId { get; set; } 

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        // Navigation
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
