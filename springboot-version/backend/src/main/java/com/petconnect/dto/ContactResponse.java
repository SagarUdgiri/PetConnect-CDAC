package com.petconnect.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ContactResponse {
    private Long id;
    private Long contactUserId;
    private String contactUserName;
    private String contactUserImage;
    private String message;
    private String contactPhone;
    private String contactEmail;
    private LocalDateTime createdAt;
}
