package com.quantum_beings.healthcare_platform.dto;

import com.quantum_beings.healthcare_platform.enums.ProviderType;

import java.time.Instant;

public record ServiceProviderDTO(
        Long id,
        String name,
        ProviderType providerType,
        Long hospitalId,
        String hospitalName,
        String contactNumber,
        String address,
        Double latitude,
        Double longitude,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {
}
