package com.quantum_beings.healthcare_platform.services;

import java.util.List;

public interface MedicalReportChunkingService {
    List<String> chunkText(String text);
}
