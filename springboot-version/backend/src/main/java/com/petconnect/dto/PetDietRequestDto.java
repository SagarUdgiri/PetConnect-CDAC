package com.petconnect.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PetDietRequestDto {
	
	@NotBlank(message = "Pet type is required")
    private String petType;

    @NotBlank(message = "Breed is required")
    private String breed;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 50, message = "Age is unrealistically high")
    private Integer ageYears;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.1", message = "Weight must be greater than 0")
    @DecimalMax(value = "300.0", message = "Weight is unrealistically high")
    private Double weightKg;

    @NotBlank(message = "Activity level is required")
    private String activityLevel;

    @NotBlank(message = "Goal is required")
    private String goal;
}
