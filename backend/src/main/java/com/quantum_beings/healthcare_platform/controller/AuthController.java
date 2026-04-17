package com.quantum_beings.healthcare_platform.controller;

import com.quantum_beings.healthcare_platform.dto.*;
import com.quantum_beings.healthcare_platform.services.AuthService;
import com.quantum_beings.healthcare_platform.services.SignUpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup/user")
    public ResponseEntity<SignUpResponseDTO> signupUser(@RequestBody UserSignupRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(signUpService.signUpUser(request));
    }

    @PostMapping("/signup/admin")
    public ResponseEntity<SignUpResponseDTO> signupAdmin(@RequestBody AdminSignupRequestDTO request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(signUpService.signUpAdmin(request));
    }

    @PostMapping("/signup/driver")
    public ResponseEntity<SignUpResponseDTO> signupDriver(@RequestBody DriverSignupRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(signUpService.signUpDriver(request));
    }


}
