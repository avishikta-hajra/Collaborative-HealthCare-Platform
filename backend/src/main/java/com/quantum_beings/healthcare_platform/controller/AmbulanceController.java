package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.AddAmbulanceRequestDTO;
import com.quantum_beings.healthcare_platform.dto.AmbulanceResponseDTO;
import com.quantum_beings.healthcare_platform.dto.BookAmbulanceRequestDTO;
import com.quantum_beings.healthcare_platform.entity.Ambulance;
import com.quantum_beings.healthcare_platform.entity.EmergencyRequest;
import com.quantum_beings.healthcare_platform.security.CustomUserDetails;
import com.quantum_beings.healthcare_platform.services.AmbulanceLocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ambulances")
public class AmbulanceController {

    private final AmbulanceLocationService ambulanceLocationService;

    public AmbulanceController(AmbulanceLocationService ambulanceLocationService) {
        this.ambulanceLocationService = ambulanceLocationService;
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<AmbulanceResponseDTO>> getNearbyAmbulances(
            @RequestParam double lat, @RequestParam double lng, @RequestParam(defaultValue = "15.0") double radius) {
        return ResponseEntity.ok(ambulanceLocationService.getNearbyAmbulances(lat, lng, radius));
    }

    // --- ONLY ONE BOOKING ENDPOINT NOW (Using Phone Number) ---
    @PostMapping("/book")
    public ResponseEntity<?> bookAmbulance(@RequestBody BookAmbulanceRequestDTO request) {
        try {
            EmergencyRequest order = ambulanceLocationService.bookAmbulance(request);
            return ResponseEntity.ok(Map.of("message", "Ambulance booked", "orderId", order.getId()));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/driver/active-trip")
    public ResponseEntity<?> getActiveTrip(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ambulanceLocationService.getActiveTripForDriver(userDetails.getUsername())
                .map(order -> ResponseEntity.ok(Map.of(
                        "id", order.getId(),
                        "patientName", order.getPatient().getFullName(),
                        // ADD THE PATIENT's PHONE NUMBER HERE:
                        "patientPhone", order.getPatient().getAccount().getPhoneNumber(),
                        "pickupAddress", order.getPickupAddress(),
                        "dropAddress", order.getDropAddress() != null ? order.getDropAddress() : "Not Specified",
                        "status", order.getStatus().name()
                )))
                .orElse(ResponseEntity.noContent().build());
    }

    // NEW ENDPOINT FOR DRIVER TO ACCEPT THE TRIP
    @PostMapping("/trip/{id}/accept")
    public ResponseEntity<?> acceptTrip(@PathVariable Long id) {
        try {
            ambulanceLocationService.acceptTrip(id);
            return ResponseEntity.ok(Map.of("message", "Trip officially accepted"));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/trip/{id}/cancel")
    public ResponseEntity<?> cancelTrip(@PathVariable Long id) {
        try {
            ambulanceLocationService.cancelTrip(id);
            return ResponseEntity.ok(Map.of("message", "Trip cancelled successfully"));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/trip/{id}/status")
    public ResponseEntity<?> getTripStatus(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ambulanceLocationService.getTripStatus(id));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/trip/{id}/complete")
    public ResponseEntity<?> completeTrip(@PathVariable Long id) {
        try {
            ambulanceLocationService.completeTrip(id);
            return ResponseEntity.ok(Map.of("message", "Trip completed"));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Ambulance> addAmbulance(@RequestBody AddAmbulanceRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ambulanceLocationService.addAmbulance(request));
    }

    @GetMapping("/driver/me")
    public ResponseEntity<?> getDriverProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ambulanceLocationService.getDriverDashboardData(user.getUsername()));
    }

    // Toggle shift status
    @PutMapping("/driver/status")
    public ResponseEntity<?> toggleStatus(@AuthenticationPrincipal CustomUserDetails user) {
        boolean isOnline = ambulanceLocationService.toggleDriverStatus(user.getUsername());
        return ResponseEntity.ok(Map.of("isOnline", isOnline));
    }

    // Get past trips
    @GetMapping("/driver/history")
    public ResponseEntity<?> getDriverHistory(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ambulanceLocationService.getDriverHistory(user.getUsername()));
    }

    @PutMapping("/{ambulanceId}/assign-driver/{driverId}")
    public ResponseEntity<?> assignDriver(@PathVariable Long ambulanceId, @PathVariable Long driverId) {
        try {
            return ResponseEntity.ok(ambulanceLocationService.assignDriverToAmbulance(ambulanceId, driverId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/trip/{id}/rate")
    public ResponseEntity<?> rateTrip(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Number ratingNumber = (Number) payload.get("rating");
            Integer rating = ratingNumber != null ? ratingNumber.intValue() : null;
            String review = (String) payload.getOrDefault("review", "");

            ambulanceLocationService.rateTrip(id, rating, review);
            return ResponseEntity.ok(Map.of("message", "Rating submitted successfully"));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}