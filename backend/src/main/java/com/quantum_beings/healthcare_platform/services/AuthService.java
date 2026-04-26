package com.quantum_beings.healthcare_platform.services;

import com.quantum_beings.healthcare_platform.common.exceptions.BadRequestException;
import com.quantum_beings.healthcare_platform.dto.LoginRequestDTO;
import com.quantum_beings.healthcare_platform.dto.LoginResponseDTO;
import com.quantum_beings.healthcare_platform.dto.RefreshTokenRequestDTO;
import com.quantum_beings.healthcare_platform.entity.Account;
import com.quantum_beings.healthcare_platform.entity.RefreshToken;
import com.quantum_beings.healthcare_platform.enums.AccountStatus;
import com.quantum_beings.healthcare_platform.security.CustomUserDetails;
import io.jsonwebtoken.JwtException;
import com.quantum_beings.healthcare_platform.repository.AccountRepository;
import com.quantum_beings.healthcare_platform.repository.RefreshTokenRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;


@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthService(AuthenticationManager authenticationManager, AccountRepository accountRepository, JwtService jwtService, RefreshTokenRepository refreshTokenRepository) {
        this.authenticationManager = authenticationManager;
        this.accountRepository = accountRepository;
        this.jwtService = jwtService;
        this.refreshTokenRepository = refreshTokenRepository;
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

        RefreshToken token = RefreshToken
                .builder().
                account(account).
                token(refreshToken).
                expiryAt(jwtService.getRefreshTokenExpiryTime()).
                build();
        refreshTokenRepository.save(token);


        return new LoginResponseDTO(
                accessToken,
                refreshToken,
                "Bearer",
                account.getEmail(),
                account.getRole()
        );

    }

    public LoginResponseDTO refresh(RefreshTokenRequestDTO request) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new BadRequestException("Refresh token not found"));

        if (Boolean.TRUE.equals(storedToken.getRevoked())) {
            throw new BadRequestException("Refresh token has been revoked");
        }

        if (storedToken.getExpiryAt().isBefore(Instant.now())) {
            throw new BadRequestException("Refresh token has expired");
        }

        Account account = storedToken.getAccount();

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException("Account is not active");
        }

        UserDetails userDetails = new CustomUserDetails(account);

        try {
            if (!jwtService.isRefreshTokenValid(request.refreshToken(), userDetails)) {
                throw new BadRequestException("Refresh token is invalid");
            }
        } catch (JwtException | IllegalArgumentException ex) {
            throw new BadRequestException("Refresh token is invalid", ex);
        }

        String accessToken = jwtService.generateAccessToken(account);

        return new LoginResponseDTO(
                accessToken,
                storedToken.getToken(),
                "Bearer",
                account.getEmail(),
                account.getRole()
        );
    }


}
