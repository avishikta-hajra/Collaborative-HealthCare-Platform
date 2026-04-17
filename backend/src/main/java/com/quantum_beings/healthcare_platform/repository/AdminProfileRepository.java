package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.AdminProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminProfileRepository extends JpaRepository<AdminProfile, Long> {
}
