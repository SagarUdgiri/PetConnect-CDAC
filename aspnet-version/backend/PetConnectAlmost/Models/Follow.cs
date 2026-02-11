using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetConnectAlmost.Models
{
    [Table("follows")]
    public class Follow
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("follower_id")]
        public long FollowerId { get; set; }

        [Column("following_id")]
        public long FollowingId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("status")]
        [MaxLength(20)]
        public string Status { get; set; } = "PENDING"; // PENDING, ACCEPTED

        [ForeignKey("FollowerId")]
        public virtual User Follower { get; set; } = null!;

        [ForeignKey("FollowingId")]
        public virtual User Following { get; set; } = null!;
    }
}
