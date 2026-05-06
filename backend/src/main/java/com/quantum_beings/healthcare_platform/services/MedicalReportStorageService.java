package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.dto.StoredFileResult;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;



public interface MedicalReportStorageService {
    StoredFileResult store(MultipartFile file, Long patientProfileId);
}
