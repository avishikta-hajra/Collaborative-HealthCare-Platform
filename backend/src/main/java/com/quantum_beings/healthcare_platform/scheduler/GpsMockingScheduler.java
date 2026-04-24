package com.quantum_beings.healthcare_platform.scheduler;

import com.quantum_beings.healthcare_platform.entity.Ambulance;
import com.quantum_beings.healthcare_platform.enums.AmbulanceStatus;
import com.quantum_beings.healthcare_platform.repository.AmbulanceRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Random;

@Configuration
@EnableScheduling
public class GpsMockingScheduler {

    private final AmbulanceRepository ambulanceRepository;
    private final Random random = new Random();

    public GpsMockingScheduler(AmbulanceRepository ambulanceRepository) {
        this.ambulanceRepository = ambulanceRepository;
    }

    // Runs every 10 seconds to update active ambulance locations
    @Scheduled(fixedRate = 10000)
    @Transactional
    public void simulateAmbulanceMovement() {
        List<Ambulance> activeAmbulances = ambulanceRepository.findByStatusAndIsActiveTrue(AmbulanceStatus.AVAILABLE);

        for (Ambulance ambulance : activeAmbulances) {
            // Generates a tiny random coordinate shift (~10-50 meters)
            double latOffset = (random.nextDouble() - 0.5) * 0.0005;
            double lngOffset = (random.nextDouble() - 0.5) * 0.0005;

            ambulance.setCurrentLatitude(ambulance.getCurrentLatitude() + latOffset);
            ambulance.setCurrentLongitude(ambulance.getCurrentLongitude() + lngOffset);
            ambulance.setCurrentLocationUpdatedAt(Instant.now());
        }

        ambulanceRepository.saveAll(activeAmbulances);
    }
}