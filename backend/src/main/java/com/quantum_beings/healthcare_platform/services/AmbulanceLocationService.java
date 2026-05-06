package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.common.exceptions.ResourceNotFoundException;
import com.quantum_beings.healthcare_platform.common.exceptions.BadRequestException;
import com.quantum_beings.healthcare_platform.dto.AddAmbulanceRequestDTO;
import com.quantum_beings.healthcare_platform.dto.AmbulanceResponseDTO;
import com.quantum_beings.healthcare_platform.dto.BookAmbulanceRequestDTO;
import com.quantum_beings.healthcare_platform.entity.*;
import com.quantum_beings.healthcare_platform.enums.AmbulanceStatus;
import com.quantum_beings.healthcare_platform.enums.DriverAvailabilityStatus;
import com.quantum_beings.healthcare_platform.enums.EmergencyRequestStatus;
import com.quantum_beings.healthcare_platform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DecimalFormat;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AmbulanceLocationService {

    private final AmbulanceRepository ambulanceRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final EmergencyRequestRepository emergencyRequestRepository;
    private final DriverProfileRepository driverProfileRepository;

    private static final DecimalFormat df = new DecimalFormat("0.0");
    private static final double AVERAGE_SPEED_KMPH = 22.0;
    private static final double ROUTING_DETOUR_FACTOR = 1.4;

    public AmbulanceLocationService(AmbulanceRepository ambulanceRepository,
                                    ServiceProviderRepository serviceProviderRepository,
                                    PatientProfileRepository patientProfileRepository,
                                    EmergencyRequestRepository emergencyRequestRepository,
                                    DriverProfileRepository driverProfileRepository) {
        this.ambulanceRepository = ambulanceRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.emergencyRequestRepository = emergencyRequestRepository;
        this.driverProfileRepository = driverProfileRepository;
    }

    private double calculateAverageRating(Ambulance ambulance) {
        // Get all completed requests for this specific ambulance that have a rating
        List<EmergencyRequest> ratedTrips = emergencyRequestRepository.findAll().stream()
                .filter(req -> req.getAssignedAmbulance() != null
                        && req.getAssignedAmbulance().getId().equals(ambulance.getId())
                        && req.getRating() != null)
                .collect(Collectors.toList());

        if (ratedTrips.isEmpty()) {
            return 5.0; // Default rating for new ambulances with no trips
        }

        double sum = 0;
        for (EmergencyRequest trip : ratedTrips) {
            sum += trip.getRating();
        }
        return Math.round((sum / ratedTrips.size()) * 10.0) / 10.0;
    }
    public List<AmbulanceResponseDTO> getNearbyAmbulances(double userLat, double userLng, double radiusKm) {
        List<Ambulance> availableAmbulances = ambulanceRepository.findByStatusAndIsActiveTrue(AmbulanceStatus.AVAILABLE);

        return availableAmbulances.stream()
                .map(amb -> {
                    double distKm = calculateHaversineDistance(userLat, userLng, amb.getCurrentLatitude(), amb.getCurrentLongitude()) * ROUTING_DETOUR_FACTOR;
                    int etaMinutes = (int) Math.round((distKm / AVERAGE_SPEED_KMPH) * 60);
                    double dynamicRating = calculateAverageRating(amb);

                    // FIX: Safely route through the Driver to get the Service Provider's name
                    String providerName = (amb.getCurrentDriver() != null && amb.getCurrentDriver().getServiceProvider() != null)
                            ? amb.getCurrentDriver().getServiceProvider().getName()
                            : "Independent Provider";

                    return AmbulanceResponseDTO.builder()
                            .id(amb.getId())
                            .provider(providerName)
                            .type(amb.getVehicleType())
                            .distance(df.format(distKm) + " km")
                            .eta(etaMinutes + " mins")
                            .rating(dynamicRating)
                            .lat(amb.getCurrentLatitude())
                            .lng(amb.getCurrentLongitude())
                            .build();
                })
                .filter(dto -> Double.parseDouble(dto.distance().replace(" km", "")) <= radiusKm)
                .sorted((a1, a2) -> Double.compare(
                        Double.parseDouble(a1.distance().replace(" km", "")),
                        Double.parseDouble(a2.distance().replace(" km", ""))
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public EmergencyRequest bookAmbulance(BookAmbulanceRequestDTO request) {
        PatientProfile patient = patientProfileRepository.findByAccount_PhoneNumberOrEmergencyContactPhone(
                request.patientPhoneNumber(), request.patientPhoneNumber()
        ).orElseThrow(() -> new ResourceNotFoundException("No patient found with phone number: " + request.patientPhoneNumber()));

        Ambulance ambulance = ambulanceRepository.findById(request.ambulanceId())
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found"));

        if (ambulance.getStatus() != AmbulanceStatus.AVAILABLE) {
            throw new BadRequestException("This ambulance was just booked by someone else.");
        }

        ambulance.setStatus(AmbulanceStatus.BUSY);
        DriverProfile driver = ambulance.getCurrentDriver();
        if (driver != null) {
            driver.setAvailabilityStatus(DriverAvailabilityStatus.ON_TRIP);
            driverProfileRepository.save(driver);
        }
        ambulanceRepository.save(ambulance);

        EmergencyRequest order = EmergencyRequest.builder()
                .patient(patient)
                // FIX: Route through the Driver to assign the Provider
                .assignedProvider(driver != null ? driver.getServiceProvider() : null)
                .assignedDriver(driver)
                .assignedAmbulance(ambulance)
                .pickupLatitude(request.pickupLat())
                .pickupLongitude(request.pickupLng())
                .pickupAddress(request.pickupAddress())
                .dropAddress(request.dropAddress())
                .status(EmergencyRequestStatus.DISPATCHED)
                .build();

        return emergencyRequestRepository.save(order);
    }

    @Transactional
    public void completeTrip(Long requestId) {
        EmergencyRequest order = emergencyRequestRepository.findById(requestId).orElseThrow();
        order.setStatus(EmergencyRequestStatus.COMPLETED);
        order.setCompletedAt(Instant.now());
        emergencyRequestRepository.save(order);

        Ambulance amb = order.getAssignedAmbulance();
        if (amb != null) {
            amb.setStatus(AmbulanceStatus.AVAILABLE);
            ambulanceRepository.save(amb);
        }
        DriverProfile driver = order.getAssignedDriver();
        if (driver != null) {
            driver.setAvailabilityStatus(DriverAvailabilityStatus.AVAILABLE);
            driverProfileRepository.save(driver);
        }
    }

    public Optional<EmergencyRequest> getActiveTripForDriver(String driverEmail) {
        return emergencyRequestRepository.findFirstByAssignedDriver_Account_EmailAndStatusInOrderByRequestedAtDesc(
                driverEmail, List.of(EmergencyRequestStatus.DISPATCHED, EmergencyRequestStatus.ACCEPTED));
    }

    public Ambulance addAmbulance(AddAmbulanceRequestDTO request) {
        DriverProfile driver = driverProfileRepository.findById(request.serviceProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        return ambulanceRepository.save(Ambulance.builder()
                .currentDriver(driver) // FIX: Directly binds the Driver
                .vehicleNumber(request.vehicleNumber())
                .vehicleType(request.vehicleType())
                .capacity(request.capacity())
                .currentLatitude(request.initialLatitude())
                .currentLongitude(request.initialLongitude())
                .status(AmbulanceStatus.AVAILABLE)
                .isActive(true)
                .build());
    }

    public Map<String, Object> getDriverDashboardData(String email) {
        DriverProfile driver = driverProfileRepository.findByAccount_Email(email).orElseThrow();
        Ambulance ambulance = ambulanceRepository.findByCurrentDriver_Id(driver.getId()).orElse(null);
        Long trips = emergencyRequestRepository.countByAssignedDriver_IdAndStatus(driver.getId(), EmergencyRequestStatus.COMPLETED);

        return Map.of(
                "name", driver.getFullName(),
                "license", driver.getLicenseNumber(),
                "phone", driver.getAccount().getPhoneNumber(),
                "provider", driver.getServiceProvider() != null ? driver.getServiceProvider().getName() : "Independent",
                "vehicleNumber", ambulance != null ? ambulance.getVehicleNumber() : "Unassigned",
                "vehicleType", ambulance != null ? ambulance.getVehicleType() : "N/A",
                "isOnline", driver.getAvailabilityStatus() != DriverAvailabilityStatus.OFFLINE,
                "completedTrips", trips != null ? trips : 0,
                "rating", 4.9
        );
    }

    @Transactional
    public boolean toggleDriverStatus(String email) {
        DriverProfile driver = driverProfileRepository.findByAccount_Email(email).orElseThrow();
        Ambulance ambulance = ambulanceRepository.findByCurrentDriver_Id(driver.getId()).orElse(null);

        if (driver.getAvailabilityStatus() == DriverAvailabilityStatus.OFFLINE) {
            driver.setAvailabilityStatus(DriverAvailabilityStatus.AVAILABLE);
            if (ambulance != null && ambulance.getStatus() == AmbulanceStatus.OFFLINE) {
                ambulance.setStatus(AmbulanceStatus.AVAILABLE);
            }
            return true;
        } else {
            driver.setAvailabilityStatus(DriverAvailabilityStatus.OFFLINE);
            if (ambulance != null && ambulance.getStatus() == AmbulanceStatus.AVAILABLE) {
                ambulance.setStatus(AmbulanceStatus.OFFLINE);
            }
            return false;
        }
    }

    public List<Map<String, Object>> getDriverHistory(String email) {
        return emergencyRequestRepository.findByAssignedDriver_Account_EmailAndStatusOrderByCompletedAtDesc(email, EmergencyRequestStatus.COMPLETED)
                .stream().map(req -> Map.<String, Object>of(
                        "id", "EMG-" + req.getId(),
                        "date", req.getCompletedAt().toString(),
                        "type", req.getAssignedAmbulance() != null ? req.getAssignedAmbulance().getVehicleType() : "Ambulance",
                        "from", req.getPickupAddress(),
                        "to", req.getDropAddress() != null ? req.getDropAddress() : "Completed at Location",
                        "status", "Completed"
                )).collect(Collectors.toList());
    }
    @Transactional
    public Ambulance assignDriverToAmbulance(Long ambulanceId, Long driverId) {
        Ambulance ambulance = ambulanceRepository.findById(ambulanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Ambulance not found"));

        DriverProfile driver = driverProfileRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        ambulance.setCurrentDriver(driver);
        return ambulanceRepository.save(ambulance);
    }

    @Transactional
    public void acceptTrip(Long requestId) {
        EmergencyRequest order = emergencyRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency Request not found"));

        // 1. Mark the actual order as ACCEPTED
        order.setStatus(EmergencyRequestStatus.ACCEPTED);
        order.setAcceptedAt(Instant.now());
        emergencyRequestRepository.save(order);

        // 2. Explicitly ensure the Ambulance is marked BUSY
        Ambulance amb = order.getAssignedAmbulance();
        if (amb != null) {
            amb.setStatus(AmbulanceStatus.BUSY);
            ambulanceRepository.save(amb);
        }

        // 3. Update the Driver's profile to ON_TRIP
        DriverProfile driver = order.getAssignedDriver();
        if (driver != null) {
            driver.setAvailabilityStatus(DriverAvailabilityStatus.ON_TRIP);
            driverProfileRepository.save(driver);
        }
    }

    @Transactional
    public void cancelTrip(Long requestId) {
        EmergencyRequest order = emergencyRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency Request not found"));

        if (order.getStatus() == EmergencyRequestStatus.COMPLETED || order.getStatus() == EmergencyRequestStatus.CANCELLED) {
            throw new BadRequestException("Trip is already completed or cancelled.");
        }

        // 1. Mark the order as CANCELLED and stamp the time
        order.setStatus(EmergencyRequestStatus.CANCELLED);
        order.setCancelledAt(Instant.now());
        emergencyRequestRepository.save(order);

        // 2. Free up the Ambulance so it shows on the map again
        Ambulance amb = order.getAssignedAmbulance();
        if (amb != null) {
            amb.setStatus(AmbulanceStatus.AVAILABLE);
            ambulanceRepository.save(amb);
        }

        // 3. Free up the Driver so they can receive new pings
        DriverProfile driver = order.getAssignedDriver();
        if (driver != null) {
            driver.setAvailabilityStatus(DriverAvailabilityStatus.AVAILABLE);
            driverProfileRepository.save(driver);
        }
    }

    public Map<String, Object> getTripStatus(Long id) {
        EmergencyRequest order = emergencyRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        return Map.of(
                "status", order.getStatus().name(),
                "driverName", order.getAssignedDriver() != null ? order.getAssignedDriver().getFullName() : "Waiting for driver",
                "driverPhone", order.getAssignedDriver() != null ? order.getAssignedDriver().getAccount().getPhoneNumber() : "",
                "vehicleNumber", order.getAssignedAmbulance() != null ? order.getAssignedAmbulance().getVehicleNumber() : "N/A"
        );
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

    @Transactional
    public void rateTrip(Long requestId, Integer rating, String review) {
        EmergencyRequest order = emergencyRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency Request not found"));

        if (order.getStatus() != EmergencyRequestStatus.COMPLETED) {
            throw new BadRequestException("Can only rate completed trips.");
        }

        order.setRating(rating);
        order.setReviewComment(review);
        emergencyRequestRepository.save(order);
    }
}