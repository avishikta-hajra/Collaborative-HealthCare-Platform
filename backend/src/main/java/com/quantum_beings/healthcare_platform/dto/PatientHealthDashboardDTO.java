package com.quantum_beings.healthcare_platform.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record PatientHealthDashboardDTO(
        Long patientProfileId,
        Long accountId,
        String email,
        String phoneNumber,
        String fullName,
        LocalDate dateOfBirth,
        Integer age,
        String gender,
        String bloodGroup,
        String emergencyContactName,
        String emergencyContactPhone,
        String homeAddress,
        Boolean isActive,
        Instant joinedAt,
        PatientDashboardStatsDTO stats,
        List<MedicalReportListItemDTO> recentReports
) {
}
