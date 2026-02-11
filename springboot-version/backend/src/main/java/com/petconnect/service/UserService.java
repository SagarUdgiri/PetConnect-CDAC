package com.petconnect.service;

import com.petconnect.dto.*;
import java.util.List;
import java.util.Map;

public interface UserService {
    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    LoginResponse verifyOtp(OtpVerifyRequest request);

    List<NearbyUserDto> getNearbyUsers(Long userId, Double radiusKm);

    List<NearbyUserDto> getNearbyUsers(Long userId, Double userLat, Double userLong, Double radiusKm);

    List<UserDto> getAllUsers();

    UserDto getUserById(Long id);

    void deleteUser(Long id);

    Map<String, Object> getSystemStats();
}
