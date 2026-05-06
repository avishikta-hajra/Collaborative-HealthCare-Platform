package com.quantum_beings.healthcare_platform.dto;

public record StoredFileResult(
        String storageProvider,
        String storageKey,
        String contentType,
        long fileSize
) {}
