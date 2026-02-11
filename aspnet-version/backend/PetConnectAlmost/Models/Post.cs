using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetConnectAlmost.Models
{
    [Table("posts")]
    public class Post
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("user_id")]
        public long UserId { get; set; }

        [Column("title")]
        public string? Title { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("image_url")]
        public string? ImageUrl { get; set; }

        [Column("visibility")]
        public string Visibility { get; set; } = "CONNECTIONS"; // PUBLIC, CONNECTIONS

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        public virtual ICollection<PostLike> Likes { get; set; } = new List<PostLike>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
