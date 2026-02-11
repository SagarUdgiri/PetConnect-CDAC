package com.petconnect.service;

import java.time.LocalDateTime;

public interface OtpService {
    String generateOtp(String email);

    boolean verifyOtp(String email, String otp);

    LocalDateTime getExpiry(String email);
}
