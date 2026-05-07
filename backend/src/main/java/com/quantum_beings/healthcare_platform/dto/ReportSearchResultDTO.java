package com.quantum_beings.healthcare_platform.dto;

public record ReportSearchResultDTO(
        String content,
        Long reportId,
        Long patientId,
        Integer chunkIndex,
        String originalFileName
) {}
