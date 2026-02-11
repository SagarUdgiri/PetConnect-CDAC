package com.petconnect.service.impl;

import com.petconnect.entity.Notification;
import com.petconnect.entity.User;
import com.petconnect.repository.NotificationRepository;
import com.petconnect.repository.UserRepository;
import com.petconnect.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final org.modelmapper.ModelMapper modelMapper;

    @Override
    @Transactional
    public void createNotification(Long userId, String type, String message, Long relatedPostId, Long senderId) {
        System.out.println("🔔 Creating notification: type=" + type + ", userId=" + userId + ", senderId=" + senderId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRelatedPostId(relatedPostId);
        notification.setSenderId(senderId);
        notification.setRead(false);

        Notification saved = notificationRepository.save(notification);
        System.out.println("✅ Notification saved with ID: " + saved.getId());
    }

    @Override
    public List<com.petconnect.dto.NotificationDto> getNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(n -> modelMapper.map(n, com.petconnect.dto.NotificationDto.class))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}
