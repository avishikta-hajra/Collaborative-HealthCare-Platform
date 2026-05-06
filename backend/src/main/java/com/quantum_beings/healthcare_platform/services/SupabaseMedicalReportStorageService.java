package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.dto.StoredFileResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@Primary
public class SupabaseMedicalReportStorageService implements MedicalReportStorageService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.secret-key}")
    private String supabaseSecretKey;

    @Value("${supabase.storage.bucket}")
    private String bucketName;

    @Override
    public StoredFileResult store(MultipartFile file, Long patientProfileId) {
        try {
            String originalFileName = file.getOriginalFilename() == null
                    ? "report.pdf"
                    : file.getOriginalFilename().replace(" ", "_");

            String storageKey = "patients/" + patientProfileId + "/" + UUID.randomUUID() + "-" + originalFileName;

            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + storageKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(supabaseSecretKey);
            headers.set("apikey", supabaseSecretKey);
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.set("x-upsert", "false");

            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Supabase upload failed: " + response.getBody());
            }

            return new StoredFileResult(
                    "SUPABASE",
                    storageKey,
                    file.getContentType(),
                    file.getSize()
            );

        } catch (IOException e) {
            throw new RuntimeException("Failed to read uploaded file", e);
        }
    }
}
