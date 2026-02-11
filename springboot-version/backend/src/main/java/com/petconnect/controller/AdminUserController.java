package com.petconnect.controller;

import com.petconnect.service.OrderService;
import com.petconnect.service.UserService;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Validated
@RestController
@RequestMapping("/api/admin-users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    private final UserService userService;
    private final OrderService orderService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(userService.getSystemStats());
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/all-orders")
    public ResponseEntity<?> getAllOrders() {
            return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/u/{id}")
    public ResponseEntity<?> getUserById(@PathVariable @Positive(message = "User ID must be a positive number") Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @DeleteMapping("/u/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable @Positive(message = "User ID must be a positive number") Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
