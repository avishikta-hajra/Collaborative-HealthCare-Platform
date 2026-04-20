package com.quantum_beings.healthcare_platform.dto;

import java.time.LocalDate;

public record UserSignupRequestDTO(
        String email,
        String password,
        String phoneNumber,
        String fullName,
        LocalDate dateOfBirth,
        String gender,
        String bloodGroup,
        String emergencyContactName,
        String emergencyContactPhone,
        String homeAddress
) {
}
