package com.petconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private Long postId;
    private String title;
    private String description;
    private String imageUrl;
    private String visibility;
    private LocalDateTime createdAt;
    private Long userId;
    private String userFullName;
    private String userProfileImageUrl;
    private int likesCount;
    private List<CommentDto> comments;
}
