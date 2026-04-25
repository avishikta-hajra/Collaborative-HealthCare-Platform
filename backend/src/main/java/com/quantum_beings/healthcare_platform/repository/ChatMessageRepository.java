package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // This will let us load chat history when someone joins the room
    List<ChatMessage> findBySessionIdOrderByTimestampAsc(Long sessionId);
}