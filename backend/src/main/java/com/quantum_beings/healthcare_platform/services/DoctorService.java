package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.dto.DoctorProfileDTO;
// ADDED THESE TWO IMPORTS:
import com.quantum_beings.healthcare_platform.entity.DoctorProfile;
import com.quantum_beings.healthcare_platform.enums.DoctorStatus;

import com.quantum_beings.healthcare_platform.repository.DoctorProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorProfileRepository doctorProfileRepository;

    public DoctorService(DoctorProfileRepository doctorProfileRepository) {
        this.doctorProfileRepository = doctorProfileRepository;
    }

    public List<DoctorProfileDTO> getAllActiveDoctors() {
        return doctorProfileRepository.findByIsActiveTrue().stream()
                .map(doc -> new DoctorProfileDTO(
                        doc.getId(),
                        doc.getFullName(),
                        doc.getSpecialty(),
                        doc.getExperience(),
                        "₹ " + doc.getFee().intValue(), // Formatting to match frontend expectations
                        doc.getRating(),
                        doc.getHospitalName(),
                        doc.getStatus(),
                        doc.getCurrentQueueSize()
                ))
                .collect(Collectors.toList());
    }

    public void updateDoctorStatusByAccountId(Long accountId, DoctorStatus newStatus) {
        // Find the doctor profile linked to this account
        DoctorProfile doctor = doctorProfileRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Doctor not found for this account"));

        doctor.setStatus(newStatus);
        doctorProfileRepository.save(doctor);
    }

    // ADDED THIS MISSING METHOD:
    public boolean isDoctorAvailableByAccountId(Long accountId) {
        DoctorProfile doctor = doctorProfileRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Doctor not found for this account"));
        return doctor.getStatus() == DoctorStatus.AVAILABLE;
    }
}