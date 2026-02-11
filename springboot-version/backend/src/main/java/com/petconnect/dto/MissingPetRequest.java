package com.petconnect.dto;

import com.petconnect.entity.MissingPetReport.ReportStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MissingPetRequest {

    private Long petId; // optional

    @NotBlank(message = "Pet name is required")
    @Size(min = 2, max = 50)
    private String petName;

    @NotBlank(message = "Species is required")
    private String species;

    @Size(max = 50)
    private String breed;

    @NotBlank(message = "Description is required")
    @Size(max = 500)
    private String description;

    @NotBlank(message = "Last seen location is required")
    private String lastSeenLocation;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private Double longitude;

    @Pattern(
        regexp = "^(http|https)://.*$",
        message = "Image URL must be a valid URL"
    )
    private String imageUrl;

    @NotNull(message = "Status is required")
    private ReportStatus status;
}
