package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.*;
import com.quantum_beings.healthcare_platform.security.CustomUserDetails;
import com.quantum_beings.healthcare_platform.services.MedicalReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class MedicalReportController {

    private final MedicalReportService medicalReportService;

    public MedicalReportController(MedicalReportService medicalReportService) {
        this.medicalReportService = medicalReportService;
    }

    @PostMapping("/upload")
    public ResponseEntity<UploadMedicalReportResponseDTO> uploadReport(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(medicalReportService.uploadReport(file, userDetails));
    }

    @GetMapping("/my")
    public ResponseEntity<List<MedicalReportListItemDTO>> getMyReports(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(medicalReportService.getMyReports(userDetails));
    }
    @PostMapping("/search")
    public ResponseEntity<List<ReportSearchResultDTO>> searchReports(
            @RequestBody ReportSearchRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(medicalReportService.searchMyReports(request, userDetails));
    }

    @PostMapping("/ask")
    public ResponseEntity<ReportQuestionAnswerDTO> askQuestionAboutReports(
            @RequestBody ReportSearchRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(medicalReportService.askQuestionAboutMyReports(request, userDetails));
    }


}
