package com.petconnect.dto;

import jakarta.validation.constraints.Min;
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
public class PetCreateDto {

    @NotBlank(message = "Pet name is required")
    @Size(min = 2, max = 50, message = "Pet name must be between 2 and 50 characters")
    private String petName;

    @NotBlank(message = "Breed is required")
    @Size(min = 2, max = 50, message = "Breed must be between 2 and 50 characters")
    private String breed;

    @NotBlank(message = "Species is required")
    @Size(min = 2, max = 30, message = "Species must be between 2 and 30 characters")
    private String species;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age cannot be negative")
    private Integer age;

    @Pattern(
        regexp = "^(http|https)://.*$",
        message = "Image URL must be a valid URL"
    )
    private String imageUrl;
}
