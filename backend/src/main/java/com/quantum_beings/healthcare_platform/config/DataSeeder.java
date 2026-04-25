package com.quantum_beings.healthcare_platform.config;

import com.quantum_beings.healthcare_platform.entity.Account;
import com.quantum_beings.healthcare_platform.entity.DoctorProfile;
import com.quantum_beings.healthcare_platform.enums.AccountStatus;
import com.quantum_beings.healthcare_platform.enums.DoctorStatus;
import com.quantum_beings.healthcare_platform.enums.Role;
import com.quantum_beings.healthcare_platform.repository.AccountRepository;
import com.quantum_beings.healthcare_platform.repository.DoctorProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(AccountRepository accountRepository,
                                   DoctorProfileRepository doctorProfileRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if we already have doctors so we don't create duplicates on every restart
            if (doctorProfileRepository.count() == 0) {

                System.out.println("Seeding database with mock doctors...");

                // --- DOCTOR 1: Available ---
                Account doc1Account = Account.builder()
                        .email("arvind.mehta@hospital.com")
                        .password(passwordEncoder.encode("password123"))
                        .phoneNumber("9876543210")
                        .role(Role.DOCTOR)
                        .status(AccountStatus.ACTIVE)
                        .build();
                accountRepository.save(doc1Account);

                DoctorProfile doc1Profile = DoctorProfile.builder()
                        .account(doc1Account)
                        .fullName("Dr. Arvind Mehta")
                        .specialty("General Physician")
                        .experience("12 yrs")
                        .fee(500.0)
                        .rating(4.9)
                        .hospitalName("Apollo e-Health")
                        .status(DoctorStatus.AVAILABLE)
                        .currentQueueSize(0)
                        .build();
                doctorProfileRepository.save(doc1Profile);

                // --- DOCTOR 2: In Call (Waitlist testing) ---
                Account doc2Account = Account.builder()
                        .email("priya.desai@hospital.com")
                        .password(passwordEncoder.encode("password123"))
                        .phoneNumber("9123456780")
                        .role(Role.DOCTOR)
                        .status(AccountStatus.ACTIVE)
                        .build();
                accountRepository.save(doc2Account);

                DoctorProfile doc2Profile = DoctorProfile.builder()
                        .account(doc2Account)
                        .fullName("Dr. Priya Desai")
                        .specialty("Dermatology")
                        .experience("6 yrs")
                        .fee(700.0)
                        .rating(4.7)
                        .hospitalName("SkinLife Center")
                        .status(DoctorStatus.IN_CALL)
                        .currentQueueSize(2) // 2 people already waiting
                        .build();
                doctorProfileRepository.save(doc2Profile);

                System.out.println("Mock doctors successfully seeded!");
            }
        };
    }
}