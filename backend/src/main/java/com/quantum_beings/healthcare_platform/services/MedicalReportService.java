package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.common.exceptions.ResourceNotFoundException;
import com.quantum_beings.healthcare_platform.dto.MedicalReportListItemDTO;
import com.quantum_beings.healthcare_platform.dto.StoredFileResult;
import com.quantum_beings.healthcare_platform.dto.UploadMedicalReportResponseDTO;
import com.quantum_beings.healthcare_platform.entity.MedicalReport;
import com.quantum_beings.healthcare_platform.entity.MedicalReportChunk;
import com.quantum_beings.healthcare_platform.entity.PatientProfile;
import com.quantum_beings.healthcare_platform.enums.MedicalReportProcessingStatus;
import com.quantum_beings.healthcare_platform.repository.MedicalReportChunkRepository;
import com.quantum_beings.healthcare_platform.repository.MedicalReportRepository;
import com.quantum_beings.healthcare_platform.repository.PatientProfileRepository;
import com.quantum_beings.healthcare_platform.security.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class MedicalReportService {

    private final MedicalReportRepository medicalReportRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final MedicalReportStorageService medicalReportStorageService;
    private final PdfTextExtractionService pdfTextExtractionService;
    private final MedicalReportChunkRepository medicalReportChunkRepository;
    private final MedicalReportChunkingService medicalReportChunkingService;
    private final MedicalReportEmbeddingService medicalReportEmbeddingService;




    public MedicalReportService(MedicalReportRepository medicalReportRepository,
                                PatientProfileRepository patientProfileRepository,
                                MedicalReportStorageService medicalReportStorageService, PdfTextExtractionService pdfTextExtractionService, MedicalReportChunkRepository medicalReportChunkRepository, MedicalReportChunkingService medicalReportChunkingService, MedicalReportEmbeddingService medicalReportEmbeddingService) {
        this.medicalReportRepository = medicalReportRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.medicalReportStorageService = medicalReportStorageService;
        this.pdfTextExtractionService = pdfTextExtractionService;
        this.medicalReportChunkRepository = medicalReportChunkRepository;
        this.medicalReportChunkingService = medicalReportChunkingService;
        this.medicalReportEmbeddingService = medicalReportEmbeddingService;
    }

    public UploadMedicalReportResponseDTO uploadReport(MultipartFile file,
                                                       CustomUserDetails userDetails) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Uploaded file is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
            throw new RuntimeException("Only PDF files are allowed");
        }

        PatientProfile patientProfile = patientProfileRepository
                .findByAccount_Email(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Patient profile not found for logged-in user"));

        StoredFileResult storedFileResult = medicalReportStorageService.store(file, patientProfile.getId());

        String extractedText = pdfTextExtractionService.extractText(file);

        MedicalReport medicalReport = MedicalReport.builder()
                .patientProfile(patientProfile)
                .originalFileName(file.getOriginalFilename())
                .storageProvider(storedFileResult.storageProvider())
                .storageKey(storedFileResult.storageKey())
                .contentType(storedFileResult.contentType())
                .fileSize(storedFileResult.fileSize())
                .processingStatus(MedicalReportProcessingStatus.UPLOADED)
                .extractedText(extractedText)
                .extractionMethod(extractedText.isBlank() ? "NOT_EXTRACTED" : "PDF_TEXT")
                .build();

        MedicalReport savedReport = medicalReportRepository.save(medicalReport);

        if (savedReport.getExtractedText() != null && !savedReport.getExtractedText().isBlank()) {
            List<String> chunks = medicalReportChunkingService.chunkText(savedReport.getExtractedText());

            List<MedicalReportChunk> reportChunks = new ArrayList<>();

            for (int i = 0; i < chunks.size(); i++) {
                reportChunks.add(
                        MedicalReportChunk.builder()
                                .medicalReport(savedReport)
                                .chunkIndex(i)
                                .chunkText(chunks.get(i))
                                .build()
                );
            }


            List<MedicalReportChunk> savedChunks = medicalReportChunkRepository.saveAll(reportChunks);
            medicalReportEmbeddingService.embedReportChunks(savedReport, savedChunks);

        }


        return new UploadMedicalReportResponseDTO(
                savedReport.getId(),
                savedReport.getOriginalFileName(),
                savedReport.getStorageProvider(),
                savedReport.getProcessingStatus().name(),
                savedReport.getUploadedAt()
        );
    }
    public List<MedicalReportListItemDTO> getMyReports(CustomUserDetails userDetails) {
        PatientProfile patientProfile = patientProfileRepository
                .findByAccount_Email(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for logged-in user"));

        return medicalReportRepository.findByPatientProfileIdOrderByUploadedAtDesc(patientProfile.getId())
                .stream()
                .map(report -> new MedicalReportListItemDTO(
                        report.getId(),
                        report.getOriginalFileName(),
                        report.getStorageProvider(),
                        report.getProcessingStatus().name(),
                        report.getUploadedAt()
                ))
                .toList();
    }

}

