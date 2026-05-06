package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {
    // Fetch all doctors who are currently active on the platform
    List<DoctorProfile> findByIsActiveTrue();
    Optional<DoctorProfile> findByAccountId(Long accountId);
}