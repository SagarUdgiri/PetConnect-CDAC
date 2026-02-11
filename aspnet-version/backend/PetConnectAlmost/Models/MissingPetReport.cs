using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetConnectAlmost.Models
{
    [Table("missing_pet_reports")]
    public class MissingPetReport
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("reporter_id")]
        public long ReporterId { get; set; }

        [Column("pet_id")]
        public long? PetId { get; set; }

        [Required]
        [Column("pet_name")]
        public string PetName { get; set; }

        [Required]
        [Column("species")]
        public string Species { get; set; }

        [Column("breed")]
        public string? Breed { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("last_seen_location")]
        public string? LastSeenLocation { get; set; }
        
        [Column("latitude")]
        public double Latitude { get; set; }
        
        [Column("longitude")]
        public double Longitude { get; set; }

        [Column("image_url")]
        public string? ImageUrl { get; set; }

        [Required]
        [Column("status")]
        public string Status { get; set; } // MISSING, FOUND, REUNITED

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        // Navigation
        [ForeignKey("ReporterId")]
        public virtual User Reporter { get; set; }

        [ForeignKey("PetId")]
        public virtual Pet? Pet { get; set; }

        public virtual ICollection<MissingPetContact> Contacts { get; set; } = new List<MissingPetContact>();
    }
}
