package com.quantum_beings.healthcare_platform.services;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantum_beings.healthcare_platform.dto.ReportAnswerSectionDTO;
import com.quantum_beings.healthcare_platform.dto.ReportAnswerStatus;
import com.quantum_beings.healthcare_platform.dto.ReportQuestionAnswerDTO;
import com.quantum_beings.healthcare_platform.dto.ReportSearchResultDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MedicalReportQaService {

    private static final List<String> CLINICAL_SECTION_ORDER = List.of(
            "Summary",
            "Key findings",
            "Normal vs abnormal indicators",
            "Recommended follow-up / advice note",
            "Missing or unavailable information"
    );

    private final MedicalReportRetrievalService medicalReportRetrievalService;
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public MedicalReportQaService(MedicalReportRetrievalService medicalReportRetrievalService,
                                  ChatClient.Builder chatClientBuilder,
                                  ObjectMapper objectMapper) {
        this.medicalReportRetrievalService = medicalReportRetrievalService;
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public ReportQuestionAnswerDTO answerPatientQuestion(String query, Long patientId) {
        List<ReportSearchResultDTO> supportingChunks =
                medicalReportRetrievalService.searchPatientReportsForQa(query, patientId);

        if (supportingChunks.isEmpty()) {
            return buildNotFoundResponse();
        }

        String context = supportingChunks.stream()
                .map(chunk -> """
                        Chunk %d
                        File: %s
                        Content:
                        %s
                        """.formatted(
                        chunk.chunkIndex(),
                        chunk.originalFileName(),
                        chunk.content()
                ))
                .collect(Collectors.joining("\n\n"));

        String prompt = """
                You are a medical report assistant for a healthcare MVP.

                Use only the provided medical report context. Do not invent findings, diagnoses, or advice that is not supported by the text.
                If the uploaded reports do not answer the user's question, return a JSON response whose answerStatus is NOT_FOUND.
                If the uploaded reports do answer the question, return a JSON response whose answerStatus is ANSWERED.

                For ANSWERED responses, produce a clinical-summary format with these exact section titles in this exact order:
                1. Summary
                2. Key findings
                3. Normal vs abnormal indicators
                4. Recommended follow-up / advice note
                5. Missing or unavailable information

                Rules:
                - Keep each section concise and specific to the uploaded report.
                - Mention concrete lab values, units, ranges, dates, and names only when present in context.
                - If a section has no usable evidence, say "Not available in the uploaded report."
                - Avoid broad phrases like "the report indicates" unless the report text directly supports them.
                - Do not give a diagnosis. At most, suggest that the user discuss abnormal values with a clinician.
                - Return valid JSON only. Do not wrap it in markdown fences.

                Use this JSON shape exactly:
                {
                  "answerStatus": "ANSWERED" or "NOT_FOUND",
                  "answer": "short overall answer",
                  "summarySections": [
                    {"title": "Summary", "content": "..."},
                    {"title": "Key findings", "content": "..."},
                    {"title": "Normal vs abnormal indicators", "content": "..."},
                    {"title": "Recommended follow-up / advice note", "content": "..."},
                    {"title": "Missing or unavailable information", "content": "..."}
                  ]
                }

                User question:
                %s

                Medical report context:
                %s
                """.formatted(query, context);

        String rawResponse = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        StructuredQaResponse structuredQaResponse = parseStructuredResponse(rawResponse);

        if (structuredQaResponse == null || structuredQaResponse.answerStatus() == null) {
            return buildNotFoundResponse();
        }

        if (structuredQaResponse.answerStatus() == ReportAnswerStatus.NOT_FOUND || looksUnavailable(structuredQaResponse.answer())) {
            return buildNotFoundResponse();
        }

        List<ReportAnswerSectionDTO> orderedSections = orderAndSanitizeSections(structuredQaResponse.summarySections());
        String answer = sanitizeText(structuredQaResponse.answer());

        if (orderedSections.isEmpty() || answer.isBlank()) {
            return buildNotFoundResponse();
        }

        return new ReportQuestionAnswerDTO(
                answer,
                ReportAnswerStatus.ANSWERED,
                orderedSections,
                supportingChunks
        );
    }

    private StructuredQaResponse parseStructuredResponse(String rawResponse) {
        if (rawResponse == null || rawResponse.isBlank()) {
            return null;
        }

        String normalized = rawResponse.trim()
                .replace("```json", "")
                .replace("```", "")
                .trim();

        try {
            return objectMapper.readValue(normalized, StructuredQaResponse.class);
        } catch (JsonProcessingException ignored) {
            return null;
        }
    }

    private List<ReportAnswerSectionDTO> orderAndSanitizeSections(List<ReportAnswerSectionDTO> sections) {
        if (sections == null || sections.isEmpty()) {
            return List.of();
        }

        Map<String, String> byTitle = sections.stream()
                .filter(section -> section != null && section.title() != null)
                .collect(Collectors.toMap(
                        section -> section.title().trim().toLowerCase(Locale.ROOT),
                        section -> sanitizeText(section.content()),
                        (first, second) -> first
                ));

        return CLINICAL_SECTION_ORDER.stream()
                .map(title -> new ReportAnswerSectionDTO(
                        title,
                        byTitle.getOrDefault(title.toLowerCase(Locale.ROOT), "Not available in the uploaded report.")
                ))
                .toList();
    }

    private boolean looksUnavailable(String answer) {
        String normalized = sanitizeText(answer).toLowerCase(Locale.ROOT);
        return normalized.contains("not available")
                || normalized.contains("not present")
                || normalized.contains("cannot be determined")
                || normalized.contains("not found in the uploaded report");
    }

    private String sanitizeText(String value) {
        if (value == null) {
            return "";
        }
        return value.trim().replaceAll("\\s+", " ");
    }

    private ReportQuestionAnswerDTO buildNotFoundResponse() {
        return new ReportQuestionAnswerDTO(
                "The information is not available in the uploaded reports.",
                ReportAnswerStatus.NOT_FOUND,
                List.of(
                        new ReportAnswerSectionDTO("Summary", "The uploaded reports do not clearly answer this question."),
                        new ReportAnswerSectionDTO("Key findings", "Not available in the uploaded report."),
                        new ReportAnswerSectionDTO("Normal vs abnormal indicators", "Not available in the uploaded report."),
                        new ReportAnswerSectionDTO("Recommended follow-up / advice note", "Consider uploading the relevant lab or consultation report, or ask a more specific question about the available document."),
                        new ReportAnswerSectionDTO("Missing or unavailable information", "The information needed for this answer is not present in the uploaded reports.")
                ),
                List.of()
        );
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record StructuredQaResponse(
            ReportAnswerStatus answerStatus,
            String answer,
            List<ReportAnswerSectionDTO> summarySections
    ) {
    }
}
