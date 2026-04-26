package com.quantum_beings.healthcare_platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class HealthcarePlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(HealthcarePlatformApplication.class, args);

		System.out.println("Loading....");
		System.out.println("HealthcarePlatformApplication started");
	}

}
