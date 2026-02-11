package com.petconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "missing_pet_contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MissingPetContact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private MissingPetReport report;

    @ManyToOne
    @JoinColumn(name = "contact_user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User contactUser;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String contactPhone;
    private String contactEmail;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
