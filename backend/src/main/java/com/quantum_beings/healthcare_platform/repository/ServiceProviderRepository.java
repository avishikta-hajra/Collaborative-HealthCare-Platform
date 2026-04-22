package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
}
