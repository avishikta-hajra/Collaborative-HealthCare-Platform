package com.quantum_beings.healthcare_platform.dto;

import com.quantum_beings.healthcare_platform.enums.DoctorStatus;

public record DoctorProfileDTO(
        Long id,
        String name,
        String specialty,
        String experience,
        String fee,           // Sent as a formatted string e.g., "₹ 500"
        Double rating,
        String hospital,
        DoctorStatus status,
        Integer queue         // Matches currentQueueSize
) {}