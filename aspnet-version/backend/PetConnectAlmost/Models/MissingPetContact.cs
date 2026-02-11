using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetConnectAlmost.Models
{
    [Table("missing_pet_contacts")]
    public class MissingPetContact
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("report_id")]
        public long ReportId { get; set; }

        [Column("contact_user_id")]
        public long ContactUserId { get; set; }

        [Column("message")]
        public string? Message { get; set; }

        [Column("contact_phone")]
        public string? ContactPhone { get; set; }

        [Column("contact_email")]
        public string? ContactEmail { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        // Navigation
        [ForeignKey("ReportId")]
        public virtual MissingPetReport Report { get; set; }

        [ForeignKey("ContactUserId")]
        public virtual User ContactUser { get; set; }
    }
}
