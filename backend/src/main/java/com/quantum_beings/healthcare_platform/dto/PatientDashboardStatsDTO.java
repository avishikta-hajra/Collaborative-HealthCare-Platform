package com.quantum_beings.healthcare_platform.dto;

import java.time.Instant;

public record PatientDashboardStatsDTO(
        int totalReports,
        int processedReports,
        int needsAttentionReports,
        Instant latestReportUploadedAt
) {
}
