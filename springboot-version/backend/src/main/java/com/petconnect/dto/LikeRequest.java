package com.petconnect.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class LikeRequest {
	@NotNull(message = "Post Id is required")
	@Positive(message = "Post Id must be a positive number")
    private Long postId;
	@NotNull(message = "User Id is required")
	@Positive(message = "User Id must be a positive number")
    private Long userId;
}
