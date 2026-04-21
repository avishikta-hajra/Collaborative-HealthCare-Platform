package com.quantum_beings.healthcare_platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AdminSignupRequestDTO(
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must contain 10 to 15 digits")
        String phoneNumber,

        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
        String fullName,

        @NotBlank(message = "Designation is required")
        @Size(min = 2, max = 100, message = "Designation must be between 2 and 100 characters")
        String designation,

        @NotBlank(message = "Employee ID is required")
        @Size(min = 2, max = 50, message = "Employee ID must be between 2 and 50 characters")
        String employeeId,

        @NotNull(message = "Hospital ID is required")
        Long hospitalId
) {
}
