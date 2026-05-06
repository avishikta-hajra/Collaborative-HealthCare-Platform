package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.entity.MedicalReport;
import com.quantum_beings.healthcare_platform.entity.MedicalReportChunk;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MedicalReportEmbeddingService {

    private final VectorStore vectorStore;

    public MedicalReportEmbeddingService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void embedReportChunks(MedicalReport medicalReport, List<MedicalReportChunk> chunks) {
        List<Document> documents = chunks.stream()
                .map(chunk -> new Document(
                        chunk.getChunkText(),
                        Map.of(
                                "reportId", medicalReport.getId(),
                                "patientId", medicalReport.getPatientProfile().getId(),
                                "chunkId", chunk.getId(),
                                "chunkIndex", chunk.getChunkIndex(),
                                "originalFileName", medicalReport.getOriginalFileName()
                        )
                ))
                .toList();

        vectorStore.add(documents);
    }
}
