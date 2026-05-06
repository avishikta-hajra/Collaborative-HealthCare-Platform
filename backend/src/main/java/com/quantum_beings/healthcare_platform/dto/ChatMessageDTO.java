package com.quantum_beings.healthcare_platform.dto;

import com.quantum_beings.healthcare_platform.enums.SenderType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDTO {
    private Long sessionId;
    private SenderType senderType;
    private String text;
    private Instant timestamp;
}