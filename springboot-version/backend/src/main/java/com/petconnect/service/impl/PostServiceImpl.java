package com.petconnect.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.petconnect.dto.CommentDto;
import com.petconnect.dto.PostCreateUpdateRequestDto;
import com.petconnect.dto.PostDto;
import com.petconnect.entity.Comment;
import com.petconnect.entity.Post;
import com.petconnect.entity.PostLike;
import com.petconnect.entity.User;
import com.petconnect.repository.CommentRepository;
import com.petconnect.repository.PostLikeRepository;
import com.petconnect.repository.PostRepository;
import com.petconnect.repository.UserRepository;
import com.petconnect.service.NotificationService;
import com.petconnect.service.PostService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    @Override
    public PostDto createPost(PostCreateUpdateRequestDto postCreateDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = new Post();

        post.setTitle(postCreateDto.getTitle());
        post.setDescription(postCreateDto.getDescription());
        post.setImageUrl(postCreateDto.getImageUrl());
        post.setVisibility(postCreateDto.getVisibility());
        post.setUser(user);
        return mapToPostDto(postRepository.save(post));
    }

    @Override
    public List<PostDto> getAllPosts(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<PostDto> posts = postRepository.findByUser(user).stream()
                .map(this::mapToPostDto)
                .collect(Collectors.toList());
        return posts;
    }

    @Override
    public PostDto getPost(Long id) {
        return mapToPostDto(getPostEntity(id));
    }

    private Post getPostEntity(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Override
    public List<PostDto> getFeed(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<PostDto> posts = postRepository.findFeedWithConnections(user).stream()
                .map(this::mapToPostDto)
                .collect(Collectors.toList());
        return posts;
    }

    @Override
    public PostDto updatePost(Long id, PostCreateUpdateRequestDto postUpdateDto, Long userId) {
        Post post = getPostEntity(id);
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this post");
        }
        post.setTitle(postUpdateDto.getTitle());
        post.setDescription(postUpdateDto.getDescription());
        post.setImageUrl(postUpdateDto.getImageUrl());
        post.setVisibility(postUpdateDto.getVisibility());

        return mapToPostDto(postRepository.save(post));
    }

    @Override
    public void deletePost(Long id, Long userId) {
        Post post = getPostEntity(id);
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this post");
        }
        postRepository.delete(post);
    }

    @Override
    public void toggleLike(Long postId, Long userId) {
        Post post = getPostEntity(postId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (postLikeRepository.existsByPostAndUser(post, user)) {
            // Unlike
        	postLikeRepository.findByPostAndUser(post, user)
            		.ifPresent(postLikeRepository::delete);
        } else {
            // Like
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUser(user);
            postLikeRepository.save(like);

            // Trigger Notification
            if (!post.getUser().getId().equals(userId)) {
                notificationService.createNotification(
                        post.getUser().getId(),
                        "LIKE",
                        user.getUsername() + " liked your post.",
                        postId,
                        userId);
            }
        }
    }

    @Override
    public CommentDto addComment(Long postId, Long userId, String content) {
        Post post = getPostEntity(postId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(content);
        Comment savedComment = commentRepository.save(comment);

        // Trigger Notification
        if (!post.getUser().getId().equals(userId)) {
            notificationService.createNotification(
                    post.getUser().getId(),
                    "COMMENT",
                    user.getUsername() + " commented on your post: " + content,
                    postId,
                    userId);
        }
        return mapToCommentDto(savedComment);
    }

    @Override
    public List<Comment> getComments(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    @Override
    public List<CommentDto> getCommentsDto(Long postId) {
        return commentRepository.findByPostId(postId).stream()
                .map(this::mapToCommentDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isLiked(Long postId, Long userId) {
        Post post = getPostEntity(postId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return postLikeRepository.existsByPostAndUser(post, user);
    }

    @Override
    public PostDto mapToPostDto(Post post) {
        return PostDto.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .imageUrl(post.getImageUrl())
                .visibility(post.getVisibility().name())
                .createdAt(post.getCreatedAt())
                .userId(post.getUser().getId())
                .userFullName(post.getUser().getFullName())
                .userProfileImageUrl(post.getUser().getImageUrl())
                .likesCount(postLikeRepository.countByPost(post))
                .comments(commentRepository.findByPostId(post.getId()).stream()
                        .map(this::mapToCommentDto)
                        .collect(Collectors.toList()))
                .build();
    }

    @Override
    public CommentDto mapToCommentDto(Comment comment) {
        return CommentDto.builder()
                .commentId(comment.getId())
                .postId(comment.getPost().getId())
                .userId(comment.getUser().getId())
                .userFullName(comment.getUser().getFullName())
                .userProfileImageUrl(comment.getUser().getImageUrl())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
