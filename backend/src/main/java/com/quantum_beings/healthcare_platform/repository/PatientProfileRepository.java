package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // <-- Add this import

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {

    // Add this line so Spring Boot knows how to find the patient!
    Optional<PatientProfile> findByAccount_Email(String email);
    Optional<PatientProfile> findByAccount_PhoneNumber(String phoneNumber);
    Optional<PatientProfile> findByAccount_PhoneNumberOrEmergencyContactPhone(String accountPhone, String emergencyPhone);
}