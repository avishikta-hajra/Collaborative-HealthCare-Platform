package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.ConsultationSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsultationSessionRepository extends JpaRepository<ConsultationSession, Long> {
    // Finds active/waiting sessions for a specific doctor
    List<ConsultationSession> findByDoctor_Account_Email(String email);
}