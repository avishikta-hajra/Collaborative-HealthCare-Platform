package com.quantum_beings.healthcare_platform.services;

import org.springframework.web.multipart.MultipartFile;

public interface PdfTextExtractionService {
    String extractText(MultipartFile file);
}
