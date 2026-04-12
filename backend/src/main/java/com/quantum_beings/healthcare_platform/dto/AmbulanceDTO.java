package com.quantum_beings.healthcare_platform.dto;

import com.quantum_beings.healthcare_platform.enums.AmbulanceStatus;

import java.time.Instant;

public record AmbulanceDTO(
        Long id,
        Long serviceProviderId,
        String serviceProviderName,
        Long currentDriverId,
        String currentDriverName,
        String vehicleNumber,
        String vehicleType,
        Integer capacity,
        AmbulanceStatus status,
        Double currentLatitude,
        Double currentLongitude,
        Instant currentLocationUpdatedAt,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {
}
