package com.quantum_beings.healthcare_platform.dto;

import java.time.Instant;

public record MedicalReportListItemDTO(
        Long reportId,
        String originalFileName,
        String storageProvider,
        String processingStatus,
        Instant uploadedAt
) {}
