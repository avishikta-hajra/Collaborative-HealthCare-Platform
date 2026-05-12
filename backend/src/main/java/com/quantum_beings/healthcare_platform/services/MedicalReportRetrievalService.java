package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.dto.ReportSearchResultDTO;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalReportRetrievalService {

    private final VectorStore vectorStore;

    public MedicalReportRetrievalService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public List<ReportSearchResultDTO> searchPatientReports(String query, Long patientId) {
        SearchRequest searchRequest = SearchRequest.builder()
                .query(query)
                .topK(5)
                .filterExpression("patientId == " + patientId)
                .build();

        List<Document> documents = vectorStore.similaritySearch(searchRequest);

        return documents.stream()
                .map(document -> new ReportSearchResultDTO(
                        document.getText(),
                        Long.valueOf(document.getMetadata().get("reportId").toString()),
                        Long.valueOf(document.getMetadata().get("patientId").toString()),
                        Integer.valueOf(document.getMetadata().get("chunkIndex").toString()),
                        document.getMetadata().get("originalFileName").toString()
                ))
                .toList();
    }
}
