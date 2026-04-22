package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.DriverProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverProfileRepository extends JpaRepository<DriverProfile, Long> {


    boolean existsByLicenseNumber(String s);
}
