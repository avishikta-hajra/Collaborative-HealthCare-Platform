package com.quantum_beings.healthcare_platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DoctorSignupRequestDTO(
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotBlank(message = "Phone number is required")
        String phoneNumber,

        @NotBlank(message = "Full name is required")
        String fullName,

        @NotBlank(message = "Specialty is required")
        String specialty,

        @NotBlank(message = "Experience is required")
        String experience,

        @NotNull(message = "Consultation fee is required")
        Double fee,

        @NotBlank(message = "Hospital/Clinic name is required")
        String hospitalName
) {}