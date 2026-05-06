package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.dto.HospitalListingDTO;
import com.quantum_beings.healthcare_platform.entity.Hospital;
import com.quantum_beings.healthcare_platform.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    // Increased to 1.75 for realistic urban road layouts
    private static final double ROUTING_DETOUR_FACTOR = 1.75;

    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public List<HospitalListingDTO> getLiveListings(Double userLat, Double userLng) {
        List<Hospital> hospitals = hospitalRepository.findAll();

        return hospitals.stream().map(h -> {

            double distanceKm;
            if (userLat != null && userLng != null) {
                // Calculate Haversine and multiply by detour factor
                double rawDistance = calculateHaversineDistance(userLat, userLng, h.getLatitude(), h.getLongitude());
                distanceKm = Math.round((rawDistance * ROUTING_DETOUR_FACTOR) * 10.0) / 10.0;
            } else {
                distanceKm = Math.round((3.0 + (h.getId() % 5)) * 10.0) / 10.0;
            }

            return new HospitalListingDTO(
                    h.getId(),
                    h.getName(),
                    h.getCity(),
                    h.getAddress(),
                    h.getBedsAvailable(),
                    h.getOxygenCylinders(),
                    Map.of(
                            "A+", h.getBloodA(),
                            "B+", h.getBloodB(),
                            "O+", h.getBloodO()
                    ),
                    h.getContactNumber(),
                    distanceKm,
                    h.getRating(),
                    h.getReviews(),
                    h.getEmergency(),
                    h.getType(),
                    h.getVerified(),
                    h.getSpecialties(),
                    h.getUpdatedAt().toString()
            );
        }).collect(Collectors.toList());
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}