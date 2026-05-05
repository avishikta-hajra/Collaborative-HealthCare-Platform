package com.quantum_beings.healthcare_platform.dto;

public record BookAmbulanceRequestDTO(
        Long ambulanceId,
        Double pickupLat,
        Double pickupLng,
        String pickupAddress,
        String dropAddress,
        String patientPhoneNumber
) {}