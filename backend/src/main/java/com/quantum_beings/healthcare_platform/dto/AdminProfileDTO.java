package com.quantum_beings.healthcare_platform.dto;

import java.time.Instant;

public record AdminProfileDTO(
        Long id,
        Long accountId,
        Long hospitalId,
        String fullName,
        String designation,
        String employeeId,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {
}
