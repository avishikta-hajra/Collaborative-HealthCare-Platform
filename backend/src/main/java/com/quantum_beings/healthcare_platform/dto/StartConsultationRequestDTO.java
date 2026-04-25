package com.quantum_beings.healthcare_platform.dto;

public record StartConsultationRequestDTO(
        Long doctorId,
        String symptoms
) {}