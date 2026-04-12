package com.quantum_beings.healthcare_platform.entity;
import com.quantum_beings.healthcare_platform.enums.DriverAvailabilityStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "driver_profile")
public class DriverProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private ServiceProvider serviceProvider;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    @Column(nullable = false)
    private String contactNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverAvailabilityStatus availabilityStatus = DriverAvailabilityStatus.OFFLINE;

    @Column(nullable = false)
    private Boolean isActive = true;

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
