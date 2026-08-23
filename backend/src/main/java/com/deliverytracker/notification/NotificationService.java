package com.deliverytracker.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void sendNotification(
            Long orderId,
            Long customerId,
            String recipientEmail,
            String recipientPhone,
            NotificationEventType eventType,
            String message
    ) {
        // Send Email notification
        if (recipientEmail != null && !recipientEmail.isBlank()) {
            Notification emailNotif = Notification.builder()
                    .orderId(orderId)
                    .customerId(customerId)
                    .channel(NotificationChannel.EMAIL)
                    .eventType(eventType)
                    .recipient(recipientEmail)
                    .message(message)
                    .status(NotificationStatus.SENT)
                    .sentAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(emailNotif);
            log.info("[EMAIL NOTIFICATION] Sent to {}: {}", recipientEmail, message);
        }

        // Send SMS notification
        if (recipientPhone != null && !recipientPhone.isBlank()) {
            Notification smsNotif = Notification.builder()
                    .orderId(orderId)
                    .customerId(customerId)
                    .channel(NotificationChannel.SMS)
                    .eventType(eventType)
                    .recipient(recipientPhone)
                    .message(message)
                    .status(NotificationStatus.SENT)
                    .sentAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(smsNotif);
            log.info("[SMS NOTIFICATION] Sent to {}: {}", recipientPhone, message);
        }
    }
}
