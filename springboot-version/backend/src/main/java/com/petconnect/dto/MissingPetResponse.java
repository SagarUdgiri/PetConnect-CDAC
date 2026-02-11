package com.petconnect.dto;

import com.petconnect.entity.MissingPetReport.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MissingPetResponse {
    private Long id;
    private Long petId;
    private String petName;
    private String species;
    private String breed;
    private String description;
    private String lastSeenLocation;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    private ReportStatus status;
    private String reporterName;
    private Long reporterId;
    private LocalDateTime createdAt;
    private Double distance; // Distance from requesting user
}
