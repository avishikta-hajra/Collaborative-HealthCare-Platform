package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.HospitalListingDTO;
import com.quantum_beings.healthcare_platform.services.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping("/live-listings")
    public ResponseEntity<List<HospitalListingDTO>> getLiveListings(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng) {
        return ResponseEntity.ok(hospitalService.getLiveListings(lat, lng));
    }
}