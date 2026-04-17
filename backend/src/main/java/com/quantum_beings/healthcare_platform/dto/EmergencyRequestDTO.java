package com.quantum_beings.healthcare_platform.dto;

import com.quantum_beings.healthcare_platform.enums.EmergencyRequestStatus;

import java.time.Instant;

public record EmergencyRequestDTO(
        Long id,
        Long patientId,
        String patientName,
        Long requestedHospitalId,
        String requestedHospitalName,
        Long assignedProviderId,
        String assignedProviderName,
        Long assignedDriverId,
        String assignedDriverName,
        Long assignedAmbulanceId,
        String assignedAmbulanceVehicleNumber,
        Double pickupLatitude,
        Double pickupLongitude,
        String pickupAddress,
        String incidentDescription,
        EmergencyRequestStatus status,
        Instant requestedAt,
        Instant acceptedAt,
        Instant completedAt,
        Instant cancelledAt,
        Instant createdAt,
        Instant updatedAt
) {
}
