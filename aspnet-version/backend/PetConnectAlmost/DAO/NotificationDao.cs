using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.Data;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public interface INotificationDao
    {
        Task<List<Notification>> GetByUserIdAsync(long userId);
        Task CreateAsync(Notification notification);
        Task MarkAsReadAsync(long notificationId);
        Task MarkAllAsReadAsync(long userId);
    }

    public class NotificationDao : INotificationDao
    {
        private readonly ApplicationDbContext _context;

        public NotificationDao(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Notification>> GetByUserIdAsync(long userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(20)
                .ToListAsync();
        }

        public async Task CreateAsync(Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task MarkAsReadAsync(long notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task MarkAllAsReadAsync(long userId)
        {
            var unread = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var n in unread)
            {
                n.IsRead = true;
            }

            await _context.SaveChangesAsync();
        }
    }
}
