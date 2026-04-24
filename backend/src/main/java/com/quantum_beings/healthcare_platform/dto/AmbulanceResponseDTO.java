package com.quantum_beings.healthcare_platform.dto;

import lombok.Builder;

@Builder
public record AmbulanceResponseDTO(
        Long id,
        String provider,
        String type,
        String distance,
        String eta,
        Double rating,
        Double lat,
        Double lng
) {}