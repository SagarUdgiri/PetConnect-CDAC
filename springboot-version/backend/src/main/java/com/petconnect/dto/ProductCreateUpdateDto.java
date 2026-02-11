package com.petconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

import jakarta.validation.constraints.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateUpdateDto {
	
	@NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Product name must be 2–100 characters")
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @Pattern(
        regexp = "^(http|https)://.*$",
        message = "Image URL must be a valid URL"
    )
    private String imageUrl;

    private boolean isAvailable; 

    @NotNull(message = "Category is required")
    private Long categoryId;
}
