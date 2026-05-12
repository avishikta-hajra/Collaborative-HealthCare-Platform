package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.dto.ReportQuestionAnswerDTO;
import com.quantum_beings.healthcare_platform.dto.ReportSearchResultDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalReportQaService {

    private final MedicalReportRetrievalService medicalReportRetrievalService;
    private final ChatClient chatClient;

    public MedicalReportQaService(MedicalReportRetrievalService medicalReportRetrievalService,
                                  ChatClient.Builder chatClientBuilder) {
        this.medicalReportRetrievalService = medicalReportRetrievalService;
        this.chatClient = chatClientBuilder.build();
    }

    public ReportQuestionAnswerDTO answerPatientQuestion(String query, Long patientId) {
        List<ReportSearchResultDTO> supportingChunks =
                medicalReportRetrievalService.searchPatientReports(query, patientId);

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
                You are a medical report assistant.

                Answer the user's question using only the provided medical report context.
                If the answer is not present in the context, say clearly that the information is not available in the uploaded reports.
                Do not invent facts.
                Keep the answer clear and concise.

                User question:
                %s

                Medical report context:
                %s
                """.formatted(query, context);

        String answer = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        return new ReportQuestionAnswerDTO(answer, supportingChunks);
    }
}
