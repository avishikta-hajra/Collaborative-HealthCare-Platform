package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.ChatMessageDTO;
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

    public TelemedicineSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Handles incoming messages from the React Frontend.
     * React sends STOMP messages to /app/chat/{sessionId}
     */
    @MessageMapping("/chat/{sessionId}")
    public void handleChatMessage(@DestinationVariable String sessionId, @Payload ChatMessageDTO message) {
        // Broadcast the message to anyone subscribed to this specific session's chat room
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, message);
    }

    /**
     * Broadcasts queue updates.
     * Call this from your services when a doctor accepts/ends a call.
     */
    public void updateQueuePosition(Long doctorId, int newQueueSize) {
        messagingTemplate.convertAndSend("/topic/queue/" + doctorId, newQueueSize);
    }

    /**
     * --- TEMPORARY TESTING ENDPOINT ---
     * Allows us to simulate a doctor replying by sending an HTTP POST request from Postman.
     */
    @PostMapping("/api/test-doctor-reply")
    public void simulateDoctorReply(@RequestBody ChatMessageDTO message) {
        // Broadcast the Postman HTTP message directly into the live WebSocket stream
        messagingTemplate.convertAndSend("/topic/session/" + message.sessionId(), message);
    }
}