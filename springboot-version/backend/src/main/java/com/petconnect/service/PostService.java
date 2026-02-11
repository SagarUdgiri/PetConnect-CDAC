package com.petconnect.service;

import com.petconnect.dto.CommentDto;
import com.petconnect.dto.PostCreateUpdateRequestDto;
import com.petconnect.dto.PostDto;
import com.petconnect.entity.Comment;
import com.petconnect.entity.Post;
import java.util.List;

public interface PostService {
    PostDto createPost(PostCreateUpdateRequestDto postCreateDto, Long userId);

    List<PostDto> getAllPosts(Long userId);

    PostDto getPost(Long id);

    List<PostDto> getFeed(Long userId);

    PostDto updatePost(Long id, PostCreateUpdateRequestDto postUpdateDto, Long userId);

    void deletePost(Long id, Long userId);

    void toggleLike(Long postId, Long userId);

    CommentDto addComment(Long postId, Long userId, String content);

    List<Comment> getComments(Long postId);

    List<CommentDto> getCommentsDto(Long postId);

    boolean isLiked(Long postId, Long userId);

    PostDto mapToPostDto(Post post);

    CommentDto mapToCommentDto(Comment comment);
}
