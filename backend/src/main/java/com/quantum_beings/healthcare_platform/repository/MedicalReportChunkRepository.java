package com.quantum_beings.healthcare_platform.repository;

import com.quantum_beings.healthcare_platform.entity.MedicalReportChunk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalReportChunkRepository extends JpaRepository<MedicalReportChunk, Long> {
    List<MedicalReportChunk> findByMedicalReportIdOrderByChunkIndexAsc(Long medicalReportId);
}
