package com.quantum_beings.healthcare_platform.dto;

import java.util.List;

public record ReportQuestionAnswerDTO(
        String answer,
        List<ReportSearchResultDTO> supportingChunks
) {}
