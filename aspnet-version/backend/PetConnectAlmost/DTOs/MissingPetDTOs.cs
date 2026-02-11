using System;

namespace PetConnectAlmost.DTOs
{
    public class MissingPetRequest
    {
        public long? PetId { get; set; }
        public string PetName { get; set; }
        public string Species { get; set; }
        public string Breed { get; set; }
        public string Description { get; set; }
        public string LastSeenLocation { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string ImageUrl { get; set; }
        public string Status { get; set; } // MISSING, FOUND
    }

    public class MissingPetResponse
    {
        public long Id { get; set; }
        public long? PetId { get; set; }
        public string PetName { get; set; }
        public string Species { get; set; }
        public string Breed { get; set; }
        public string Description { get; set; }
        public string LastSeenLocation { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string ImageUrl { get; set; }
        public string Status { get; set; }
        public string ReporterName { get; set; }
        public long ReporterId { get; set; }
        public int ContactCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public double Distance { get; set; }
    }

    public class ContactRequest
    {
        public string Message { get; set; }
    }

    public class ContactResponse
    {
        public long Id { get; set; }
        public long ContactUserId { get; set; }
        public string ContactUserName { get; set; }
        public string ContactUserImage { get; set; }
        public string Message { get; set; }
        public string ContactPhone { get; set; }
        public string ContactEmail { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
