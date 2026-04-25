package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.ChatMessageDTO;
import com.quantum_beings.healthcare_platform.entity.ChatMessage;
import com.quantum_beings.healthcare_platform.entity.ConsultationSession;
import com.quantum_beings.healthcare_platform.repository.ChatMessageRepository;
import com.quantum_beings.healthcare_platform.repository.ConsultationSessionRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TelemedicineSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final ConsultationSessionRepository consultationSessionRepository;

    public TelemedicineSocketController(SimpMessagingTemplate messagingTemplate,
                                        ChatMessageRepository chatMessageRepository,
                                        ConsultationSessionRepository consultationSessionRepository) {
        this.messagingTemplate = messagingTemplate;
        this.chatMessageRepository = chatMessageRepository;
        this.consultationSessionRepository = consultationSessionRepository;
    }

    @MessageMapping("/chat/{sessionId}")
    public void handleChatMessage(@DestinationVariable String sessionId, @Payload ChatMessageDTO message) {
        // 1. Find the active session in the database
        Long parsedSessionId = Long.parseLong(sessionId);
        ConsultationSession session = consultationSessionRepository.findById(parsedSessionId)
                .orElse(null); // In a production app, you'd handle this error more gracefully!

        // 2. Save the message to the database
        if (session != null) {
            ChatMessage chatMessage = ChatMessage.builder()
                    .session(session)
                    .senderType(message.senderType())
                    .messageText(message.text())
                    .build();
            chatMessageRepository.save(chatMessage);
        }

        // 3. Broadcast the message to the room
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, message);
    }

    public void updateQueuePosition(Long doctorId, int newQueueSize) {
        messagingTemplate.convertAndSend("/topic/queue/" + doctorId, newQueueSize);
    }

    @PostMapping("/api/test-doctor-reply")
    public void simulateDoctorReply(@RequestBody ChatMessageDTO message) {
        // Save simulated doctor message
        ConsultationSession session = consultationSessionRepository.findById(message.sessionId()).orElse(null);
        if (session != null) {
            ChatMessage chatMessage = ChatMessage.builder()
                    .session(session)
                    .senderType(message.senderType())
                    .messageText(message.text())
                    .build();
            chatMessageRepository.save(chatMessage);
        }

        messagingTemplate.convertAndSend("/topic/session/" + message.sessionId(), message);
    }
}