package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.DoctorProfileDTO;
import com.quantum_beings.healthcare_platform.services.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}