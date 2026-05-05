package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.EmergencyRequest;
import com.quantum_beings.healthcare_platform.enums.EmergencyRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {
    Optional<EmergencyRequest> findFirstByAssignedDriver_Account_EmailAndStatusInOrderByRequestedAtDesc(
    String email, List<EmergencyRequestStatus> statuses);
    List<EmergencyRequest> findByAssignedDriver_Account_EmailAndStatusOrderByCompletedAtDesc(String email, EmergencyRequestStatus status);
    Long countByAssignedDriver_IdAndStatus(Long driverId, EmergencyRequestStatus status);
}