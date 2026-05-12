package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.dto.ReportSearchResultDTO;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MedicalReportRetrievalService {

    private static final Set<String> STOP_WORDS = Set.of(
            "a", "about", "all", "am", "an", "and", "are", "be", "can", "did", "for", "from",
            "had", "has", "have", "i", "if", "in", "into", "is", "it", "latest", "me",
            "medical", "my", "of", "on", "or", "report", "show", "summary", "tell",
            "that", "the", "this", "to", "uploaded", "ur", "was", "what",
            "with", "you", "your"
    );

    private final VectorStore vectorStore;

    public MedicalReportRetrievalService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public List<ReportSearchResultDTO> searchPatientReports(String query, Long patientId) {
        return searchPatientReports(query, patientId, 5);
    }

    public List<ReportSearchResultDTO> searchPatientReportsForQa(String query, Long patientId) {
        List<ReportSearchResultDTO> candidates = searchPatientReports(query, patientId, 8).stream()
                .filter(chunk -> chunk.content() != null && !chunk.content().isBlank())
                .toList();

        if (candidates.isEmpty()) {
            return List.of();
        }

        if (isBroadSummaryQuestion(query)) {
            return candidates.stream()
                    .filter(this::hasMeaningfulChunkContent)
                    .limit(3)
                    .toList();
        }

        Set<String> queryTokens = extractMeaningfulTokens(query);

        return candidates.stream()
                .filter(this::hasMeaningfulChunkContent)
                .filter(chunk -> isRelevantChunk(chunk, queryTokens))
                .limit(3)
                .toList();
    }

    private List<ReportSearchResultDTO> searchPatientReports(String query, Long patientId, int topK) {
        SearchRequest searchRequest = SearchRequest.builder()
                .query(query)
                .topK(topK)
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

    private boolean isBroadSummaryQuestion(String query) {
        String normalized = query == null ? "" : query.toLowerCase();
        return normalized.contains("summar")
                || normalized.contains("tell me about")
                || normalized.contains("overview")
                || normalized.contains("explain my")
                || normalized.contains("medical report")
                || normalized.contains("health report");
    }

    private boolean hasMeaningfulChunkContent(ReportSearchResultDTO chunk) {
        return chunk.content() != null && chunk.content().trim().length() >= 40;
    }

    private boolean isRelevantChunk(ReportSearchResultDTO chunk, Set<String> queryTokens) {
        if (queryTokens.isEmpty()) {
            return false;
        }

        Set<String> chunkTokens = extractMeaningfulTokens(chunk.content());
        long sharedTokens = queryTokens.stream()
                .filter(chunkTokens::contains)
                .count();

        if (sharedTokens >= 2) {
            return true;
        }

        if (sharedTokens == 1) {
            return queryTokens.stream()
                    .filter(chunkTokens::contains)
                    .anyMatch(token -> token.length() >= 5);
        }

        return false;
    }

    private Set<String> extractMeaningfulTokens(String text) {
        if (text == null || text.isBlank()) {
            return Set.of();
        }

        return Arrays.stream(text.toLowerCase().split("[^a-z0-9+]+"))
                .map(String::trim)
                .filter(token -> !token.isBlank())
                .filter(token -> token.length() >= 2)
                .filter(token -> !STOP_WORDS.contains(token))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
