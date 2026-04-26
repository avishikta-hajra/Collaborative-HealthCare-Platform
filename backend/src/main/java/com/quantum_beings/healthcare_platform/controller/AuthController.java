package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.*;
import jakarta.validation.Valid;
import com.quantum_beings.healthcare_platform.services.AuthService;
import com.quantum_beings.healthcare_platform.services.SignUpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final SignUpService signUpService;

    public AuthController(AuthService authService, SignUpService signUpService) {
        this.authService = authService;
        this.signUpService = signUpService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@Valid @RequestBody RefreshTokenRequestDTO request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @PostMapping("/signup/user")
    public ResponseEntity<SignUpResponseDTO> signupUser(@Valid @RequestBody UserSignupRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(signUpService.signUpUser(request));
    }

    @PostMapping("/signup/admin")
    public ResponseEntity<SignUpResponseDTO> signupAdmin(@Valid @RequestBody AdminSignupRequestDTO request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(signUpService.signUpAdmin(request));
    }

    @PostMapping("/signup/driver")
    public ResponseEntity<SignUpResponseDTO> signupDriver(@Valid @RequestBody DriverSignupRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(signUpService.signUpDriver(request));
    }


}
