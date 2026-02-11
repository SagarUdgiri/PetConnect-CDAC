package com.petconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private String type;
    private String message;

    @com.fasterxml.jackson.annotation.JsonProperty("isRead")
    private boolean isRead;

    private Long relatedPostId;
    private Long senderId;
    private LocalDateTime createdAt;
}
