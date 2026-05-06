package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.dto.StoredFileResult;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;


public class FakeMedicalReportStorageService implements MedicalReportStorageService {

    @Override
    public StoredFileResult store(MultipartFile file, Long patientProfileId) {
        String originalFileName = file.getOriginalFilename() == null
                ? "report.pdf"
                : file.getOriginalFilename();

        String generatedStorageKey = "temp/" + UUID.randomUUID() + "-" + originalFileName;

        return new StoredFileResult(
                "TEMP_FAKE_STORAGE",
                generatedStorageKey,
                file.getContentType(),
                file.getSize()
        );
    }


}
