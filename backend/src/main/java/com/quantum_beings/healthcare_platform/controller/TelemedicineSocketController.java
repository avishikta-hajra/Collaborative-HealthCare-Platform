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
    public void handleChatMessage(@DestinationVariable("sessionId") String sessionId, @Payload ChatMessageDTO message) {
        try {
            // 1. Find the active session in the database safely
            Long parsedSessionId = Long.parseLong(sessionId);
            ConsultationSession session = consultationSessionRepository.findById(parsedSessionId)
                    .orElse(null);

            // 2. Save the message to the database
            if (session != null) {
                ChatMessage chatMessage = ChatMessage.builder()
                        .session(session)
                        .senderType(message.getSenderType()) // Updated to use getter
                        .messageText(message.getText())      // Updated to use getter
                        .build();
                chatMessageRepository.save(chatMessage);
            } else {
                System.err.println("Warning: Received chat message for non-existent session ID: " + parsedSessionId);
            }

            // 3. Broadcast the message to the room
            messagingTemplate.convertAndSend("/topic/session/" + sessionId, message);

        } catch (NumberFormatException e) {
            System.err.println("Error: Invalid WebSocket session ID format received: '" + sessionId + "'");
        } catch (Exception e) {
            System.err.println("Error processing chat message: " + e.getMessage());
        }
    }

    public void updateQueuePosition(Long doctorId, int newQueueSize) {
        messagingTemplate.convertAndSend("/topic/queue/" + doctorId, newQueueSize);
    }
}