package com.quantum_beings.healthcare_platform.entity;
import com.quantum_beings.healthcare_platform.enums.EmergencyRequestStatus;
import lombok.*;
import java.time.Instant;
import jakarta.persistence.*;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "emergency_request")
public class EmergencyRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientProfile patient;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital requestedHospital;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private ServiceProvider assignedProvider;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private DriverProfile assignedDriver;

    @ManyToOne
    @JoinColumn(name = "ambulance_id")
    private Ambulance assignedAmbulance;

    @Column(nullable = false)
    private Double pickupLatitude;

    @Column(nullable = false)
    private Double pickupLongitude;

    @Column(nullable = false)
    private String pickupAddress;

    @Column(columnDefinition = "TEXT")
    private String incidentDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmergencyRequestStatus status = EmergencyRequestStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private Instant requestedAt;

    private Instant acceptedAt;

    private Instant completedAt;

    private Instant cancelledAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        requestedAt = now;
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }


}
