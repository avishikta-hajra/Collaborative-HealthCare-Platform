package com.quantum_beings.healthcare_platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserSignupRequestDTO(
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

        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be in the past")
        LocalDate dateOfBirth,

        @NotBlank(message = "Gender is required")
        String gender,

        @NotBlank(message = "Blood group is required")
        @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Blood group must be like A+, O-, AB+")
        String bloodGroup,

        @NotBlank(message = "Emergency contact name is required")
        @Size(min = 2, max = 100, message = "Emergency contact name must be between 2 and 100 characters")
        String emergencyContactName,

        @NotBlank(message = "Emergency contact phone is required")
        @Pattern(regexp = "^[0-9]{10,15}$", message = "Emergency contact phone must contain 10 to 15 digits")
        String emergencyContactPhone,

        @NotBlank(message = "Home address is required")
        @Size(min = 5, max = 255, message = "Home address must be between 5 and 255 characters")
        String homeAddress
) {
}
