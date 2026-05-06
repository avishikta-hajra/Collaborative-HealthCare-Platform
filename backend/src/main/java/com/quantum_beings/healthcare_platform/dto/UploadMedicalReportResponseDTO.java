package com.quantum_beings.healthcare_platform.dto;

import java.time.Instant;

public record UploadMedicalReportResponseDTO(
        Long reportId,
        String originalFileName,
        String storageProvider,
        String processingStatus,
        Instant uploadedAt
) {}
