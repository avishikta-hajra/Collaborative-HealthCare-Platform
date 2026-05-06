package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.DoctorProfileDTO;
import com.quantum_beings.healthcare_platform.enums.DoctorStatus;
import com.quantum_beings.healthcare_platform.services.DoctorService;
import com.quantum_beings.healthcare_platform.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<List<DoctorProfileDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllActiveDoctors());
    }

    // FIXED: Now properly fetching the logged-in doctor's account ID
    @PutMapping("/status")
    public ResponseEntity<?> updateStatus(
            @RequestParam String status,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long accountId = userDetails.getAccount().getId();
        doctorService.updateDoctorStatusByAccountId(accountId, DoctorStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok().build();
    }
}