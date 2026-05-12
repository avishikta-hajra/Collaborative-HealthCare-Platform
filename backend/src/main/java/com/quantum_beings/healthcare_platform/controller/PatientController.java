package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.PatientHealthDashboardDTO;
import com.quantum_beings.healthcare_platform.security.CustomUserDetails;
import com.quantum_beings.healthcare_platform.services.PatientDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientDashboardService patientDashboardService;

    public PatientController(PatientDashboardService patientDashboardService) {
        this.patientDashboardService = patientDashboardService;
    }

    @GetMapping("/me/dashboard")
    public ResponseEntity<PatientHealthDashboardDTO> getLoggedInPatientDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(patientDashboardService.getDashboardForLoggedInPatient(userDetails));
    }
}
