package com.quantum_beings.healthcare_platform.config;

import com.quantum_beings.healthcare_platform.entity.Account;
import com.quantum_beings.healthcare_platform.enums.AccountStatus;
import com.quantum_beings.healthcare_platform.enums.Role;
import com.quantum_beings.healthcare_platform.repository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create a default admin only if no accounts exist
            if (accountRepository.count() == 0) {
                Account admin = Account.builder()
                        .email("superadmin@healthbridge.com")
                        .password(passwordEncoder.encode("admin123"))
                        .phoneNumber("0000000000")
                        .role(Role.ADMIN)
                        .status(AccountStatus.ACTIVE)
                        .build();
                accountRepository.save(admin);
                System.out.println("Default Super Admin created!");
            }
        };
    }
}