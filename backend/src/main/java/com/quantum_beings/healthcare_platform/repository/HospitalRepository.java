package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {

}
