package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.common.exceptions.ResourceNotFoundException;
import com.quantum_beings.healthcare_platform.dto.AddAmbulanceRequestDTO;
import com.quantum_beings.healthcare_platform.dto.AmbulanceResponseDTO;
import com.quantum_beings.healthcare_platform.entity.Ambulance;
import com.quantum_beings.healthcare_platform.entity.ServiceProvider;
import com.quantum_beings.healthcare_platform.enums.AmbulanceStatus;
import com.quantum_beings.healthcare_platform.repository.AmbulanceRepository;
import com.quantum_beings.healthcare_platform.repository.ServiceProviderRepository;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AmbulanceLocationService {

    private final AmbulanceRepository ambulanceRepository;
    private final ServiceProviderRepository serviceProviderRepository;

    private static final DecimalFormat df = new DecimalFormat("0.0");
    // Assuming an average city speed of 30 km/h to calculate ETA
    private static final double AVERAGE_SPEED_KMPH = 30.0;

    public AmbulanceLocationService(AmbulanceRepository ambulanceRepository, ServiceProviderRepository serviceProviderRepository) {
        this.ambulanceRepository = ambulanceRepository;
        this.serviceProviderRepository = serviceProviderRepository;
    }

    /**
     * Finds nearby available ambulances, calculates distance, and estimates arrival time.
     */
    public List<AmbulanceResponseDTO> getNearbyAmbulances(double userLat, double userLng, double radiusKm) {
        // Fetch all active ambulances that are currently marked as AVAILABLE
        List<Ambulance> availableAmbulances = ambulanceRepository.findByStatusAndIsActiveTrue(AmbulanceStatus.AVAILABLE);

        return availableAmbulances.stream()
                .map(amb -> {
                    double distKm = calculateHaversineDistance(userLat, userLng, amb.getCurrentLatitude(), amb.getCurrentLongitude());
                    int etaMinutes = (int) Math.round((distKm / AVERAGE_SPEED_KMPH) * 60);

                    // Generate a stable mock rating based on the ambulance ID (e.g., ID 1 -> 4.1, ID 8 -> 4.8)
                    double mockRating = 4.0 + ((amb.getId() % 10) / 10.0);

                    return AmbulanceResponseDTO.builder()
                            .id(amb.getId())
                            .provider(amb.getServiceProvider().getName())
                            .type(amb.getVehicleType())
                            .distance(df.format(distKm) + " km")
                            .eta(etaMinutes + " mins")
                            .rating(Double.parseDouble(df.format(mockRating)))
                            .lat(amb.getCurrentLatitude())
                            .lng(amb.getCurrentLongitude())
                            .build();
                })
                // Filter out ambulances that are further than the requested radius
                .filter(dto -> Double.parseDouble(dto.distance().replace(" km", "")) <= radiusKm)
                // Sort the remaining ambulances by distance (closest first)
                .sorted((a1, a2) -> {
                    double d1 = Double.parseDouble(a1.distance().replace(" km", ""));
                    double d2 = Double.parseDouble(a2.distance().replace(" km", ""));
                    return Double.compare(d1, d2);
                })
                .collect(Collectors.toList());
    }

    /**
     * Adds a new ambulance to the database, linked to an existing Service Provider.
     */
    public Ambulance addAmbulance(AddAmbulanceRequestDTO request) {
        ServiceProvider provider = serviceProviderRepository.findById(request.serviceProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found"));

        Ambulance ambulance = Ambulance.builder()
                .serviceProvider(provider)
                .vehicleNumber(request.vehicleNumber())
                .vehicleType(request.vehicleType())
                .capacity(request.capacity())
                .currentLatitude(request.initialLatitude())
                .currentLongitude(request.initialLongitude())
                .status(AmbulanceStatus.AVAILABLE)
                .isActive(true)
                .build();

        return ambulanceRepository.save(ambulance);
    }

    /**
     * Haversine formula to calculate the great-circle distance between two GPS coordinates.
     */
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in kilometers
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}