package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {


}
