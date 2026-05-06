package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.ChatMessageDTO;
import com.quantum_beings.healthcare_platform.dto.StartConsultationRequestDTO;
import com.quantum_beings.healthcare_platform.entity.ConsultationSession;
import com.quantum_beings.healthcare_platform.entity.DoctorProfile;
import com.quantum_beings.healthcare_platform.entity.PatientProfile;
import com.quantum_beings.healthcare_platform.enums.ConsultationStatus;
import com.quantum_beings.healthcare_platform.repository.ChatMessageRepository;
import com.quantum_beings.healthcare_platform.repository.ConsultationSessionRepository;
import com.quantum_beings.healthcare_platform.repository.DoctorProfileRepository;
import com.quantum_beings.healthcare_platform.repository.PatientProfileRepository;
import com.quantum_beings.healthcare_platform.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationSessionRepository sessionRepository;
    private final DoctorProfileRepository doctorRepository;
    private final PatientProfileRepository patientRepository;
    private final ChatMessageRepository chatMessageRepository; // <-- Added this

    public ConsultationController(ConsultationSessionRepository sessionRepository,
                                  DoctorProfileRepository doctorRepository,
                                  PatientProfileRepository patientRepository,
                                  ChatMessageRepository chatMessageRepository) { // <-- Added to constructor
        this.sessionRepository = sessionRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    @PostMapping("/start")
    public ResponseEntity<?> startConsultation(@RequestBody StartConsultationRequestDTO request,
                                               @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            PatientProfile patient = patientRepository.findByAccount_Email(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("CRASH REASON: You are logged in as a Doctor, not a Patient! Please log out and register a new Patient account."));

            DoctorProfile doctor = doctorRepository.findById(request.doctorId())
                    .orElseThrow(() -> new RuntimeException("CRASH REASON: The requested Doctor ID (" + request.doctorId() + ") does not exist in the database."));

            ConsultationSession session = ConsultationSession.builder()
                    .patient(patient)
                    .doctor(doctor)
                    .symptoms(request.symptoms())
                    .status(ConsultationStatus.WAITING)
                    .build();

            session = sessionRepository.save(session);
            System.out.println("SUCCESS! Session created with ID: " + session.getId());

            return ResponseEntity.ok(Map.of(
                    "sessionId", session.getId(),
                    "status", session.getStatus()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- NEW ENDPOINT: FETCH CHAT HISTORY ---
    @GetMapping("/{sessionId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(@PathVariable Long sessionId) {
        // Fetch from DB using the repository we created earlier, ordered by time
        List<ChatMessageDTO> history = chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId)
                .stream()
                .map(msg -> new ChatMessageDTO(
                        msg.getSession().getId(),
                        msg.getSenderType(),
                        msg.getMessageText(),
                        msg.getTimestamp()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(history);
    }

    // --- NEW ENDPOINT: DOCTOR'S QUEUE ---
    @GetMapping("/doctor/queue")
    public ResponseEntity<?> getDoctorQueue(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            List<Map<String, Object>> sessions = sessionRepository.findByDoctor_Account_Email(userDetails.getUsername())
                    .stream()
                    // ---> ADD THIS NEW FILTER LINE <---
                    .filter(session -> session.getStatus() == ConsultationStatus.ACTIVE || session.getStatus() == ConsultationStatus.WAITING)
                    .map(session -> Map.<String, Object>of(
                            "sessionId", session.getId(),
                            "patientName", session.getPatient().getFullName(),
                            "symptoms", session.getSymptoms(),
                            "status", session.getStatus()
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{sessionId}/end")
    public ResponseEntity<?> endConsultation(@PathVariable Long sessionId) {
        try {
            ConsultationSession session = sessionRepository.findById(sessionId).orElse(null);
            if (session != null) {
                session.setStatus(ConsultationStatus.COMPLETED); // Mark as done
                session.setEndedAt(Instant.now()); // Stamp the end time
                sessionRepository.save(session);
                return ResponseEntity.ok(Map.of("message", "Session officially ended"));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Session not found"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}