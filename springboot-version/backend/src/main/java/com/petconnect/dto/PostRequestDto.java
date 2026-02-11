package com.petconnect.dto;

import com.petconnect.entity.Post.Visibility;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequestDto {
	@NotNull(message = "Post Id is required")
    private Long postId;

    @NotBlank(message = "Title cannot be blank")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    @Pattern(
        regexp = "^(http|https)://.*$",
        message = "Image URL must be a valid URL"
    )
    private String imageUrl;

    @NotNull(message = "Visibility is required")
    private Visibility visibility;
}
