package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {
    List<MedicalReport> findByPatientProfileIdOrderByUploadedAtDesc(Long patientProfileId);
}
