package com.quantum_beings.healthcare_platform.dto;

public record AddAmbulanceRequestDTO(
        Long serviceProviderId,
        String vehicleNumber,
        String vehicleType,
        Integer capacity,
        Double initialLatitude,
        Double initialLongitude
) {}