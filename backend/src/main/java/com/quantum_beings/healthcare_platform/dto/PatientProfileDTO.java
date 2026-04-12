package com.quantum_beings.healthcare_platform.dto;

import java.time.Instant;
import java.time.LocalDate;

public record PatientProfileDTO(
        Long id,
        Long accountId,
        String fullName,
        LocalDate dateOfBirth,
        String gender,
        String bloodGroup,
        String emergencyContactName,
        String emergencyContactPhone,
        String homeAddress,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {
}
