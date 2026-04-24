package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.Ambulance;
import com.quantum_beings.healthcare_platform.enums.AmbulanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmbulanceRepository extends JpaRepository<Ambulance, Long> {
    List<Ambulance> findByStatusAndIsActiveTrue(AmbulanceStatus status);
}