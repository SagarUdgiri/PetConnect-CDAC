package com.petconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "missing_pet_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MissingPetReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet; // Optional link to an existing pet in the system

    @Column(nullable = false)
    private String petName;

    @Column(nullable = false)
    private String species;

    private String breed;
    private String description;
    private String lastSeenLocation;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status; // MISSING, FOUND, REUNITED

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
    private User reporter;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ReportStatus {
        MISSING, FOUND, REUNITED
    }
}
