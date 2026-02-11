using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.Data;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public class MissingPetService : IMissingPetService
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public MissingPetService(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<MissingPetResponse> CreateReportAsync(long reporterId, MissingPetRequest request)
        {
            var reporter = await _context.Users.FindAsync(reporterId);
            if (reporter == null) throw new Exception("User not found");

            var report = new MissingPetReport
            {
                ReporterId = reporterId,
                PetId = request.PetId,
                PetName = request.PetName,
                Species = request.Species,
                Breed = request.Breed,
                Description = request.Description,
                LastSeenLocation = request.LastSeenLocation,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                ImageUrl = request.ImageUrl,
                Status = request.Status,
                CreatedAt = DateTime.UtcNow
            };

            if (request.PetId.HasValue)
            {
                var pet = await _context.Pets.FindAsync(request.PetId.Value);
                if (pet != null)
                {
                    report.PetName ??= pet.PetName;
                    report.Species ??= pet.Species;
                    report.Breed ??= pet.Breed;
                }
            }

            _context.MissingPetReports.Add(report);
            await _context.SaveChangesAsync();

            if (report.Status == "MISSING")
            {
                await NotifyNearbyUsers(report);
            }

            await CheckForMatches(report);

            return MapToResponse(report, reporter.FullName, 0, 0);
        }

        public async Task<IEnumerable<MissingPetResponse>> GetNearbyReportsAsync(long userId, double radiusKm)
        {
            var user = await _context.Users.FindAsync(userId);
            var allReports = await _context.MissingPetReports
                .Include(r => r.Reporter)
                .Include(r => r.Contacts)
                .ToListAsync();

            if (user == null || !user.Latitude.HasValue || !user.Longitude.HasValue)
            {
                // Fallback: Return all reports with 0 distance if user location is unknown
                return allReports.Select(r => MapToResponse(r, r.Reporter.FullName, 0, r.Contacts?.Count ?? 0))
                                 .OrderByDescending(r => r.CreatedAt);
            }

            return allReports.Select(r =>
            {
                double distance = CalculateDistance((double)user.Latitude.Value, (double)user.Longitude.Value, r.Latitude, r.Longitude);
                return MapToResponse(r, r.Reporter.FullName, distance, r.Contacts?.Count ?? 0);
            })
            // Always show own reports, plus others within the radius
            .Where(r => r.ReporterId == userId || r.Distance <= radiusKm)
            .OrderBy(r => r.Distance);
        }

        public async Task<IEnumerable<MissingPetResponse>> GetMyReportsAsync(long userId)
        {
            var reports = await _context.MissingPetReports
                .Where(r => r.ReporterId == userId)
                .Include(r => r.Reporter)
                .Include(r => r.Contacts)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return reports.Select(r => MapToResponse(r, r.Reporter.FullName, 0, r.Contacts?.Count ?? 0));
        }

        public async Task<string> ContactReporterAsync(long reportId, long userId, string message)
        {
            var user = await _context.Users.FindAsync(userId);
            var report = await _context.MissingPetReports.Include(r => r.Reporter).FirstOrDefaultAsync(r => r.Id == reportId);

            if (user == null || report == null) throw new Exception("User or Report not found");
            if (report.ReporterId == userId) throw new Exception("You cannot contact yourself");

            var contact = new MissingPetContact
            {
                ReportId = reportId,
                ContactUserId = userId,
                Message = message,
                ContactPhone = user.Phone,
                ContactEmail = user.Email,
                CreatedAt = DateTime.UtcNow
            };

            _context.MissingPetContacts.Add(contact);
            await _context.SaveChangesAsync();

            await _notificationService.CreateNotificationAsync(report.ReporterId, "URGENT", $"{user.FullName} contacted you about your missing pet report!", reportId, userId);

            return "Message sent successfully";
        }

        public async Task<IEnumerable<ContactResponse>> GetContactsForReportAsync(long reportId, long userId)
        {
            var report = await _context.MissingPetReports.FindAsync(reportId);
            if (report == null || report.ReporterId != userId) throw new Exception("Unauthorized or report not found");

            return await _context.MissingPetContacts
                .Where(c => c.ReportId == reportId)
                .Include(c => c.ContactUser)
                .Select(c => new ContactResponse
                {
                    Id = c.Id,
                    ContactUserId = c.ContactUserId,
                    ContactUserName = c.ContactUser.FullName,
                    ContactUserImage = c.ContactUser.ImageUrl,
                    Message = c.Message,
                    ContactPhone = c.ContactPhone,
                    ContactEmail = c.ContactEmail,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<string> DeleteReportAsync(long reportId, long userId)
        {
            var report = await _context.MissingPetReports.FindAsync(reportId);
            if (report == null)
                throw new Exception("Report not found");
            
            if (report.ReporterId != userId)
                throw new Exception("Unauthorized: You can only delete your own reports");
            
            _context.MissingPetReports.Remove(report);
            await _context.SaveChangesAsync();
            
            return "Report deleted successfully";
        }

        private async Task NotifyNearbyUsers(MissingPetReport report)
        {
            double radiusKm = 5.0;
            var users = await _context.Users
                .Where(u => u.Id != report.ReporterId && u.Latitude.HasValue && u.Longitude.HasValue)
                .ToListAsync();

            foreach (var u in users)
            {
                double dist = CalculateDistance((double)u.Latitude.Value, (double)u.Longitude.Value, report.Latitude, report.Longitude);
                if (dist <= radiusKm)
                {
                    await _notificationService.CreateNotificationAsync(u.Id, "URGENT", $"MISSING PET NEARBY: {report.PetName} ({report.Species}) was last seen near {report.LastSeenLocation}", report.Id, report.ReporterId);
                }
            }
        }

        private async Task CheckForMatches(MissingPetReport newReport)
        {
            string lookForStatus = newReport.Status == "MISSING" ? "FOUND" : "MISSING";
            var candidates = await _context.MissingPetReports
                .Where(r => r.Status == lookForStatus && r.Species.ToLower() == newReport.Species.ToLower())
                .ToListAsync();

            foreach (var match in candidates)
            {
                if (match.Breed?.ToLower() == newReport.Breed?.ToLower())
                {
                    double dist = CalculateDistance(newReport.Latitude, newReport.Longitude, match.Latitude, match.Longitude);
                    if (dist <= 10.0)
                    {
                        await _notificationService.CreateNotificationAsync(newReport.ReporterId, "MATCH_FOUND", "A potential match for your " + (newReport.Status == "MISSING" ? "lost" : "found") + " pet was reported nearby!", newReport.Id, match.ReporterId);

                        await _notificationService.CreateNotificationAsync(match.ReporterId, "MATCH_FOUND", "A potential match for the pet you reported was just posted!", match.Id, newReport.ReporterId);
                    }
                }
            }
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            double R = 6371;
            double dLat = ToRadians(lat2 - lat1);
            double dLon = ToRadians(lon2 - lon1);
            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private double ToRadians(double angle) => Math.PI * angle / 180.0;

        private MissingPetResponse MapToResponse(MissingPetReport r, string reporterName, double distance, int contactCount)
        {
            return new MissingPetResponse
            {
                Id = r.Id,
                PetId = r.PetId,
                PetName = r.PetName,
                Species = r.Species,
                Breed = r.Breed,
                Description = r.Description,
                LastSeenLocation = r.LastSeenLocation,
                Latitude = r.Latitude,
                Longitude = r.Longitude,
                ImageUrl = r.ImageUrl,
                Status = r.Status,
                ReporterName = reporterName,
                ReporterId = r.ReporterId,
                ContactCount = contactCount,
                CreatedAt = r.CreatedAt,
                Distance = Math.Round(distance, 2)
            };
        }
    }
}
