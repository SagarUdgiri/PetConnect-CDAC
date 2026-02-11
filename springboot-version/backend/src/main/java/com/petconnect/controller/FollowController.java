package com.petconnect.controller;

import com.petconnect.dto.UserDto;
import com.petconnect.security.UserDetailsImpl;
import com.petconnect.service.FollowService;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequestMapping("/api/Follows")
@RequiredArgsConstructor
public class FollowController {
    private final FollowService followService;

    @PostMapping("/follow/{followingId}")
    public ResponseEntity<?> followUser(@PathVariable @Positive(message = "Following Id must be a positive number") Long followingId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(Map.of("message", followService.followUser(userDetails.getId(), followingId)));
    }

    @PostMapping("/accept-request/{followerId}")
    public ResponseEntity<?> acceptRequest(@PathVariable @Positive(message = "Follower Id must be a positive number") Long followerId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(Map.of("message", followService.acceptRequest(followerId, userDetails.getId())));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<UserDto>> getSuggestions(
            @RequestParam(required = false) Integer limit,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(followService.getSuggestions(userDetails.getId(), limit));
    }

    @PostMapping("/unfollow/{followingId}")
    public ResponseEntity<?> unfollowUser(@PathVariable @Positive(message = "Following Id must be a positive number") Long followingId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(Map.of("message", followService.unfollowUser(userDetails.getId(), followingId)));
    }

    @GetMapping("/is-following/{followingId}")
    public ResponseEntity<?> isFollowing(@PathVariable @Positive(message = "Following Id must be a positive number") Long followingId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(Map.of("status", followService.getFollowStatus(userDetails.getId(), followingId)));
    }

    @GetMapping("/connections")
    public ResponseEntity<List<UserDto>> getConnections(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(followService.getConnections(userDetails.getId()));
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<List<UserDto>> getPendingRequests(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(followService.getPendingRequests(userDetails.getId()));
    }

    @PostMapping("/cancel-request/{followingId}")
    public ResponseEntity<?> cancelRequest(@PathVariable @Positive(message = "Following Id must be a positive number") Long followingId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(Map.of("message", followService.cancelRequest(userDetails.getId(), followingId)));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam("q") @NotBlank(message = "Search query cannot be empty")
    @Size(min = 1, max = 50) String query,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(followService.searchUsers(query, userDetails.getId()));
    }
}
