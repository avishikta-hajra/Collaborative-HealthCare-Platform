package com.quantum_beings.healthcare_platform.dto;

import java.util.List;

public record ReportQuestionAnswerDTO(
        String answer,
        ReportAnswerStatus answerStatus,
        List<ReportAnswerSectionDTO> summarySections,
        List<ReportSearchResultDTO> supportingChunks
) {}
