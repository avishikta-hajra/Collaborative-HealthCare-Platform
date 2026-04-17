package com.quantum_beings.healthcare_platform.services;


import com.quantum_beings.healthcare_platform.common.exceptions.ResourceNotFoundException;
import com.quantum_beings.healthcare_platform.common.exceptions.UserAlreadyExistedException;
import com.quantum_beings.healthcare_platform.dto.*;

import com.quantum_beings.healthcare_platform.entity.*;
import com.quantum_beings.healthcare_platform.enums.AccountStatus;
import com.quantum_beings.healthcare_platform.enums.Role;
import com.quantum_beings.healthcare_platform.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SignUpService {
    private final AccountRepository accountRepository;
    private final HospitalRepository hospitalRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final AdminProfileRepository adminProfileRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final PasswordEncoder passwordEncoder;


    public SignUpService(AccountRepository accountRepository, HospitalRepository hospitalRepository, ServiceProviderRepository serviceProviderRepository, AdminProfileRepository adminProfileRepository, DriverProfileRepository driverProfileRepository, PatientProfileRepository patientProfileRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.hospitalRepository = hospitalRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.adminProfileRepository = adminProfileRepository;
        this.driverProfileRepository = driverProfileRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public SignUpResponseDTO signUpUser(UserSignupRequestDTO request)
    {
        if(accountRepository.existsByEmail(request.email()))
        {
            throw new UserAlreadyExistedException("User already exists");
        }
        Account account  = Account.builder().
                email(request.email()).
                password(passwordEncoder.encode(request.password())).
                phoneNumber(request.phoneNumber()).
                role(Role.USER).
                status(AccountStatus.ACTIVE)
                .build();

        accountRepository.save(account);

        PatientProfile patientProfile = PatientProfile.builder()
                .account(account)
                .fullName(request.fullName())
                .dateOfBirth(request.dateOfBirth())
                .gender(request.gender())
                .bloodGroup(request.bloodGroup())
                .emergencyContactName(request.emergencyContactName())
                .emergencyContactPhone(request.emergencyContactPhone())
                .homeAddress(request.homeAddress())
                .build();

        patientProfileRepository.save(patientProfile);

        return new SignUpResponseDTO("User registered successfully", request.email(), "USER");

    }



    @Transactional
    public SignUpResponseDTO signUpAdmin(AdminSignupRequestDTO request)
    {
        if(accountRepository.existsByEmail(request.email()))
        {
            throw new UserAlreadyExistedException("Admin already exists");
        }

        Hospital hospital = hospitalRepository.findById(request.hospitalId()).orElseThrow(
                () -> new ResourceNotFoundException("Hospital not found")
        );

        Account account = Account.builder().
                email(request.email()).
                password(passwordEncoder.encode(request.password())).
                phoneNumber(request.phoneNumber()).
                role(Role.ADMIN).
                status(AccountStatus.ACTIVE)
                .build();

        accountRepository.save(account);

        AdminProfile profile = AdminProfile.builder().
                account(account).
                hospital(hospital).
                fullName(request.fullName()).
                designation(request.designation()).
                employeeId(request.employeeId()).
                build();

        adminProfileRepository.save(profile);

        return new SignUpResponseDTO("Admin registered successfully", request.email(), "ADMIN");



    }
    @Transactional
    public SignUpResponseDTO signUpDriver(DriverSignupRequestDTO request)
    {
        if(accountRepository.existsByEmail(request.email()))
        {
            throw new UserAlreadyExistedException("Driver already exists");
        }
        if(driverProfileRepository.existsByLicenseNumber(request.licenseNumber()))
        {
            throw new UserAlreadyExistedException("License already exists");
        }

        ServiceProvider provider = serviceProviderRepository.findById(request.providerId()).orElseThrow(
                () -> new ResourceNotFoundException("Service provider not found")
        );

        Account account = Account.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phoneNumber(request.phoneNumber())
                .role(Role.DRIVER)
                .status(AccountStatus.ACTIVE)
                .build();

        accountRepository.save(account);

        DriverProfile driver = DriverProfile.builder()
                .account(account)
                .serviceProvider(provider)
                .fullName(request.fullName())
                .licenseNumber(request.licenseNumber())
                .build();
        driverProfileRepository.save(driver);

        return new SignUpResponseDTO("Driver registered successfully", request.email(), "DRIVER");

    }






}
