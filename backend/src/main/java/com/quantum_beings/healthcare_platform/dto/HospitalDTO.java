package com.quantum_beings.healthcare_platform.dto;

import java.time.Instant;

public record HospitalDTO(
        Long id,
        String name,
        String address,
        String city,
        String state,
        String pincode,
        Double latitude,
        Double longitude,
        String contactNumber,
        Instant createdAt,
        Instant updatedAt
) {
}
