package com.petconnect.service;

import com.petconnect.dto.NotificationDto;
import java.util.List;

public interface NotificationService {
    void createNotification(Long userId, String type, String message, Long relatedPostId, Long senderId);

    List<NotificationDto> getNotifications(Long userId);

    void markAsRead(Long notificationId);

    void markAllAsRead(Long userId);
}
