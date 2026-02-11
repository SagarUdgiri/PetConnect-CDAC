using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetConnectAlmost.Models
{
    [Table("comments")]
    public class Comment
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("post_id")]
        public long PostId { get; set; }

        [Column("user_id")]
        public long UserId { get; set; }

        [Column("content")]
        [Required]
        public string Content { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        // Navigation
        [ForeignKey("PostId")]
        public virtual Post Post { get; set; } = null!;

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}