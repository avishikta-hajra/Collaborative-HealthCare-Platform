package com.quantum_beings.healthcare_platform.dto;

import com.quantum_beings.healthcare_platform.enums.SenderType;
import java.time.Instant;

public record ChatMessageDTO(
        Long sessionId,
        SenderType senderType,
        String text,
        Instant timestamp
) {}