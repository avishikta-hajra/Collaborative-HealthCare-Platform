package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.dto.LoginRequestDTO;
import com.quantum_beings.healthcare_platform.dto.LoginResponseDTO;
import com.quantum_beings.healthcare_platform.entity.Account;
import com.quantum_beings.healthcare_platform.repository.AccountRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, AccountRepository accountRepository, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.accountRepository = accountRepository;
        this.jwtService = jwtService;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        Account account = accountRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("USER_NOT_FOUND"));

        String accessToken = jwtService.generateAccessToken(account);
        String refreshToken = jwtService.generateRefreshToken(account);

        return new LoginResponseDTO(
                accessToken,
                refreshToken,
                "Bearer",
                account.getEmail(),
                account.getRole()
        );

    }


}
