package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.AddAmbulanceRequestDTO;
import com.quantum_beings.healthcare_platform.dto.AmbulanceResponseDTO;
import com.quantum_beings.healthcare_platform.entity.Ambulance;
import com.quantum_beings.healthcare_platform.services.AmbulanceLocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
public class AmbulanceController {

    private final AmbulanceLocationService ambulanceLocationService;

    public AmbulanceController(AmbulanceLocationService ambulanceLocationService) {
        this.ambulanceLocationService = ambulanceLocationService;
    }

    /**
     * GET /api/ambulances/nearby
     * Fetches a list of available ambulances sorted by distance to the user's coordinates.
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<AmbulanceResponseDTO>> getNearbyAmbulances(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "15.0") double radius) { // Defaults to a 15km search radius

        List<AmbulanceResponseDTO> nearbyUnits = ambulanceLocationService.getNearbyAmbulances(lat, lng, radius);
        return ResponseEntity.ok(nearbyUnits);
    }

    /**
     * POST /api/ambulances/add
     * Creates a new ambulance record in the database.
     */
    @PostMapping("/add")
    public ResponseEntity<Ambulance> addAmbulance(@RequestBody AddAmbulanceRequestDTO request) {
        Ambulance savedAmbulance = ambulanceLocationService.addAmbulance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAmbulance);
    }
}