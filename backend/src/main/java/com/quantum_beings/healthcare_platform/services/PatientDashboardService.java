package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.common.exceptions.ResourceNotFoundException;
import com.quantum_beings.healthcare_platform.dto.MedicalReportListItemDTO;
import com.quantum_beings.healthcare_platform.dto.PatientDashboardStatsDTO;
import com.quantum_beings.healthcare_platform.dto.PatientHealthDashboardDTO;
import com.quantum_beings.healthcare_platform.entity.MedicalReport;
import com.quantum_beings.healthcare_platform.entity.PatientProfile;
import com.quantum_beings.healthcare_platform.enums.MedicalReportProcessingStatus;
import com.quantum_beings.healthcare_platform.repository.MedicalReportRepository;
import com.quantum_beings.healthcare_platform.repository.PatientProfileRepository;
import com.quantum_beings.healthcare_platform.security.CustomUserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class PatientDashboardService {

    private final PatientProfileRepository patientProfileRepository;
    private final MedicalReportRepository medicalReportRepository;

    public PatientDashboardService(PatientProfileRepository patientProfileRepository,
                                   MedicalReportRepository medicalReportRepository) {
        this.patientProfileRepository = patientProfileRepository;
        this.medicalReportRepository = medicalReportRepository;
    }

    public PatientHealthDashboardDTO getDashboardForLoggedInPatient(CustomUserDetails userDetails) {
        PatientProfile patientProfile = patientProfileRepository
                .findByAccount_Email(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for logged-in user"));

        List<MedicalReport> reports = medicalReportRepository
                .findByPatientProfileIdOrderByUploadedAtDesc(patientProfile.getId());

        int processedReports = (int) reports.stream()
                .filter(report -> report.getProcessingStatus() == MedicalReportProcessingStatus.PROCESSED)
                .count();

        int needsAttentionReports = (int) reports.stream()
                .filter(report -> report.getProcessingStatus() != MedicalReportProcessingStatus.PROCESSED)
                .count();

        Instant latestReportUploadedAt = reports.isEmpty() ? null : reports.getFirst().getUploadedAt();

        List<MedicalReportListItemDTO> recentReports = reports.stream()
                .limit(5)
                .map(report -> new MedicalReportListItemDTO(
                        report.getId(),
                        report.getOriginalFileName(),
                        report.getStorageProvider(),
                        report.getProcessingStatus().name(),
                        report.getUploadedAt()
                ))
                .toList();

        Integer age = patientProfile.getDateOfBirth() == null
                ? null
                : Period.between(patientProfile.getDateOfBirth(), LocalDate.now()).getYears();

        return new PatientHealthDashboardDTO(
                patientProfile.getId(),
                patientProfile.getAccount().getId(),
                patientProfile.getAccount().getEmail(),
                patientProfile.getAccount().getPhoneNumber(),
                patientProfile.getFullName(),
                patientProfile.getDateOfBirth(),
                age,
                patientProfile.getGender(),
                patientProfile.getBloodGroup(),
                patientProfile.getEmergencyContactName(),
                patientProfile.getEmergencyContactPhone(),
                patientProfile.getHomeAddress(),
                patientProfile.getIsActive(),
                patientProfile.getCreatedAt(),
                new PatientDashboardStatsDTO(
                        reports.size(),
                        processedReports,
                        needsAttentionReports,
                        latestReportUploadedAt
                ),
                recentReports
        );
    }
}
