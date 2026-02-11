package com.petconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class ContactRequest {
	@NotBlank(message = "Message cannot be empty")
    @Size(min = 1, max = 500, message = "Message must be between 1 and 500 characters")
    private String message;
}
