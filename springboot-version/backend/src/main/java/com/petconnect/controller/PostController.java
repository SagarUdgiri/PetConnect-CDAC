package com.petconnect.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petconnect.dto.LikeRequest;
import com.petconnect.dto.PostCreateUpdateRequestDto;
import com.petconnect.security.UserDetailsImpl;
import com.petconnect.service.PostService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/Posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody @Valid PostCreateUpdateRequestDto postCreateDto, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(postService.createPost(postCreateDto, userDetails.getId()));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getAllPosts(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(postService.getAllPosts(userDetails.getId()));
    }

    @GetMapping("/feed")
    public ResponseEntity<?> getFeed(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(postService.getFeed(userDetails.getId()));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getPost(@PathVariable @Positive(message = "Post Id must be a positive number") Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable @Positive(message = "Post Id must be a positive number") Long id, @RequestBody @Valid PostCreateUpdateRequestDto postUpdateDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(postService.updatePost(id, postUpdateDto, userDetails.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable @Positive(message = "Post Id must be a positive number") Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        postService.deletePost(id, userDetails.getId());
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }

    @PostMapping("/like")
    public ResponseEntity<?> toggleLike(@RequestBody @Valid LikeRequest request) {
        postService.toggleLike(request.getPostId(), request.getUserId());
        return ResponseEntity.ok(Map.of("message", "Like toggled successfully"));
    }

    @GetMapping("/{postId}/isliked")
    public ResponseEntity<?> isLiked(@PathVariable @Positive(message = "Post Id must be a positive number") Long postId, @RequestParam Long userId) {
        boolean liked = postService.isLiked(postId, userId);
        return ResponseEntity.ok(Map.of("isLiked", liked));
    }

    @PostMapping("/{postId}/addcomment")
    public ResponseEntity<?> addComment(
            @PathVariable @Positive(message = "Post Id must be a positive number") Long postId,
            @RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String content = payload.get("content").toString();
        return ResponseEntity.ok(postService.addComment(postId, userId, content));
    }

    @GetMapping("/{postId}/getcomments")
    public ResponseEntity<?> getComments(@PathVariable @Positive(message = "Post Id must be a positive number") Long postId) {
        return ResponseEntity.ok(postService.getCommentsDto(postId));
    }
}
