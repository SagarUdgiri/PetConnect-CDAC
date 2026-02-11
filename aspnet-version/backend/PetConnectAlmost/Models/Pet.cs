using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetConnectAlmost.Models
{
    [Table("pets")]
    public class Pet
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("user_id")]
        public long UserId { get; set; }

        [Required]
        [Column("pet_name")]
        public string PetName { get; set; }

        [Required]
        [Column("species")]
        public string Species { get; set; }

        [Column("breed")]
        public string? Breed { get; set; }

        [Column("age")]
        public int? Age { get; set; }

        [Column("image_url")]
        public string? ImageUrl { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        // Navigation
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
