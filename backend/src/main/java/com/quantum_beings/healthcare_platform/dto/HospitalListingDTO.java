package com.quantum_beings.healthcare_platform.dto;

import java.util.List;
import java.util.Map;

public record HospitalListingDTO(
        Long id,
        String name,
        String location,
        String address,
        Integer bedsAvailable,
        Integer oxygenCylinders,
        Map<String, Integer> bloodUnits,
        String phone,
        Double distanceKm,
        Double rating,
        Integer reviews,
        String emergency,
        String type,
        Boolean verified,
        List<String> specialties,
        String lastUpdated
) {}