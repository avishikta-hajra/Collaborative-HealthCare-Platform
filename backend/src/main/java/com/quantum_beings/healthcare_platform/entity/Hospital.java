package com.quantum_beings.healthcare_platform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "hospital")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private String contactNumber;

    // --- NEW DYNAMIC LISTING FIELDS ---
    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer reviews = 0;

    @Builder.Default
    private Integer bedsAvailable = 0;

    @Builder.Default
    private Integer oxygenCylinders = 0;

    @Builder.Default
    private Integer bloodA = 0;

    @Builder.Default
    private Integer bloodB = 0;

    @Builder.Default
    private Integer bloodO = 0;

    @Column(nullable = false)
    @Builder.Default
    private String emergency = "24/7";

    @Column(nullable = false)
    @Builder.Default
    private String type = "Private";

    @Builder.Default
    private Boolean verified = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "hospital_specialties", joinColumns = @JoinColumn(name = "hospital_id"))
    @Column(name = "specialty")
    private List<String> specialties;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}