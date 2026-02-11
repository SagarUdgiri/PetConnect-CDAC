package com.petconnect.service.impl;

import com.petconnect.service.OtpService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpServiceImpl implements OtpService {
    private final Map<String, OtpData> otpMap = new ConcurrentHashMap<>();

    @Override
    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpMap.put(email, new OtpData(otp, LocalDateTime.now().plusMinutes(5)));
        return otp;
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        OtpData data = otpMap.get(email);
        if (data == null)
            return false;

        if (data.expiry.isBefore(LocalDateTime.now())) {
            otpMap.remove(email);
            return false;
        }

        if (data.otp.equals(otp)) {
            otpMap.remove(email);
            return true;
        }
        return false;
    }

    @Override
    public LocalDateTime getExpiry(String email) {
        OtpData data = otpMap.get(email);
        return data != null ? data.expiry : null;
    }

    private static class OtpData {
        String otp;
        LocalDateTime expiry;

        OtpData(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }
}
