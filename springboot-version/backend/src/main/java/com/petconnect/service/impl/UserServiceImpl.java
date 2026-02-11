package com.petconnect.service.impl;

import com.petconnect.dto.*;
import com.petconnect.entity.User;
import com.petconnect.repository.PetRepository;
import com.petconnect.repository.PostRepository;
import com.petconnect.repository.UserRepository;
import com.petconnect.security.JwtUtils;
import com.petconnect.service.EmailService;
import com.petconnect.service.OtpService;
import com.petconnect.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final OtpService otpService;
    private final EmailService emailService;
    private final org.modelmapper.ModelMapper modelMapper;

    @Override
    public String register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = modelMapper.map(request, User.class);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        return "User registered successfully";
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String otp = otpService.generateOtp(user.getEmail());
        emailService.sendOtp(user.getEmail(), otp);

        return LoginResponse.builder()
                .otpSent(true)
                .otpExpiry(otpService.getExpiry(user.getEmail()))
                .message("OTP sent to your email")
                .build();
    }

    @Override
    public LoginResponse verifyOtp(OtpVerifyRequest request) {
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtils.generateTokenFromUsername(user.getUsername());

        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .imageUrl(user.getImageUrl())
                .bio(user.getBio())
                .message("Login successful")
                .build();
    }

    @Override
    public List<NearbyUserDto> getNearbyUsers(Long userId, Double radiusKm) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        if (currentUser.getLatitude() == null || currentUser.getLongitude() == null) {
            // If location not set, return empty or throw. Returning empty for now.
            return List.of();
        }

        return getNearbyUsers(userId, currentUser.getLatitude(), currentUser.getLongitude(), radiusKm);
    }

    @Override
    public List<NearbyUserDto> getNearbyUsers(Long userId, Double userLat, Double userLong, Double radiusKm) {
        List<User> allUsers = userRepository.findAll();
        final double CIRCUITY_FACTOR = 1.4;

        return allUsers.stream()
                .filter(u -> !u.getId().equals(userId))
                .filter(u -> !u.getRole().equals("ADMIN"))
                .filter(u -> u.getLatitude() != null && u.getLongitude() != null)
                .map(u -> {
                    double rawDistance = calculateDistance(userLat, userLong, u.getLatitude(), u.getLongitude());
                    double estimatedRoadDistance = rawDistance * CIRCUITY_FACTOR;
                    return new NearbyUserDto(u.getId(), u.getFullName(), u.getImageUrl(),
                            Math.round(estimatedRoadDistance * 100.0) / 100.0);
                })
                .filter(dto -> dto.getDistance() <= radiusKm)
                .sorted((a, b) -> a.getDistance().compareTo(b.getDistance()))
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // Earth's radius in KM
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return com.petconnect.PetConnectApplication.mapList(modelMapper, userRepository.findAll(), UserDto.class);
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Override
    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalPets", petRepository.count());
        stats.put("totalPosts", postRepository.count());
        return stats;
    }
}
