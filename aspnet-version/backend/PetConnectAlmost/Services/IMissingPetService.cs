using System.Collections.Generic;
using System.Threading.Tasks;
using PetConnectAlmost.DTOs;

namespace PetConnectAlmost.Services
{
    public interface IMissingPetService
    {
        Task<MissingPetResponse> CreateReportAsync(long reporterId, MissingPetRequest request);
        Task<IEnumerable<MissingPetResponse>> GetNearbyReportsAsync(long userId, double radiusKm);
        Task<string> ContactReporterAsync(long reportId, long userId, string message);
        Task<IEnumerable<ContactResponse>> GetContactsForReportAsync(long reportId, long userId);
        Task<IEnumerable<MissingPetResponse>> GetMyReportsAsync(long userId);
        Task<string> DeleteReportAsync(long reportId, long userId);
    }
}
