using PetConnectAlmost.DAO;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetUserNotificationsAsync(long userId);
        Task<List<NotificationDto>> GetNotificationsAsync(long userId); // Alias for controller
        Task CreateNotificationAsync(long userId, string type, string message, long? relatedPostId = null, long? senderId = null);
        Task MarkAsReadAsync(long notificationId);
        Task MarkAllAsReadAsync(long userId);
    }

    public class NotificationService : INotificationService
    {
        private readonly INotificationDao _notificationDao;

        public NotificationService(INotificationDao notificationDao)
        {
            _notificationDao = notificationDao;
        }

        public async Task<List<NotificationDto>> GetUserNotificationsAsync(long userId)
        {
            var notifications = await _notificationDao.GetByUserIdAsync(userId);
            return notifications.Select(n => new NotificationDto
            {
                NotificationId = n.Id,
                Type = n.Type,
                Message = n.Message,
                RelatedPostId = n.RelatedPostId,
                SenderId = n.SenderId,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            }).ToList();
        }

        public async Task<List<NotificationDto>> GetNotificationsAsync(long userId)
        {
            return await GetUserNotificationsAsync(userId);
        }

        public async Task CreateNotificationAsync(long userId, string type, string message, long? relatedPostId = null, long? senderId = null)
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = type,
                Message = message,
                RelatedPostId = relatedPostId,
                SenderId = senderId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };
            await _notificationDao.CreateAsync(notification);
        }

        public async Task MarkAsReadAsync(long notificationId)
        {
            await _notificationDao.MarkAsReadAsync(notificationId);
        }

        public async Task MarkAllAsReadAsync(long userId)
        {
            await _notificationDao.MarkAllAsReadAsync(userId);
        }
    }
}
