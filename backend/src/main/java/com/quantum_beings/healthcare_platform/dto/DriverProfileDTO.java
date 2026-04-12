package com.quantum_beings.healthcare_platform.dto;

import com.quantum_beings.healthcare_platform.enums.DriverAvailabilityStatus;

import java.time.Instant;

public record DriverProfileDTO(
        Long id,
        Long accountId,
        Long serviceProviderId,
        String serviceProviderName,
        String fullName,
        String licenseNumber,
        String contactNumber,
        DriverAvailabilityStatus availabilityStatus,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {
}
