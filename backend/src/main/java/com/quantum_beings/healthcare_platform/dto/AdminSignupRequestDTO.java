package com.quantum_beings.healthcare_platform.dto;

public record AdminSignupRequestDTO(
        String email,
        String password,
        String phoneNumber,
        String fullName,
        String designation,
        String employeeId,
        Long hospitalId,
        String hospitalName
) {
}
