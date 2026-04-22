package com.quantum_beings.healthcare_platform.dto;

public record DriverSignupRequestDTO(
        String email,
        String password,
        String phoneNumber,

        String fullName,
        String licenseNumber,

        Long providerId
) {}
