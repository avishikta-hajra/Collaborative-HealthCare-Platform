package com.quantum_beings.healthcare_platform.dto;

import com.quantum_beings.healthcare_platform.enums.AccountStatus;
import com.quantum_beings.healthcare_platform.enums.Role;

import java.time.Instant;

public record AccountDTO(
        Long id,
        String email,
        String phoneNumber,
        Role role,
        AccountStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
