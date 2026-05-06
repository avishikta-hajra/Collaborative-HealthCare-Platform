package com.quantum_beings.healthcare_platform.services;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OverlappingMedicalReportChunkingService implements MedicalReportChunkingService {

    private static final int CHUNK_SIZE = 1000;
    private static final int CHUNK_OVERLAP = 200;

    @Override
    public List<String> chunkText(String text) {
        List<String> chunks = new ArrayList<>();

        if (text == null || text.isBlank()) {
            return chunks;
        }

        String normalizedText = text.trim();
        int textLength = normalizedText.length();
        int start = 0;

        while (start < textLength) {
            int end = Math.min(start + CHUNK_SIZE, textLength);
            String chunk = normalizedText.substring(start, end).trim();

            if (!chunk.isBlank()) {
                chunks.add(chunk);
            }

            if (end == textLength) {
                break;
            }

            start += (CHUNK_SIZE - CHUNK_OVERLAP);
        }

        return chunks;
    }
}
