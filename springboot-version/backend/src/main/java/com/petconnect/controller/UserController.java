package com.petconnect.controller;

import com.petconnect.security.UserDetailsImpl;
import com.petconnect.service.UserService;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    
    @GetMapping("/nearby-users")
    public ResponseEntity<?> getNearbyUsers(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam @DecimalMin("-90.0") @DecimalMax("90.0") Double userLat,
            @RequestParam @DecimalMin("-180.0") @DecimalMax("180.0") Double userLong,
            @RequestParam @Positive(message = "Radius must be positive") Double radiusKm) {
        return ResponseEntity.ok(userService.getNearbyUsers(userDetails.getId(), userLat, userLong, radiusKm));
    }
}
