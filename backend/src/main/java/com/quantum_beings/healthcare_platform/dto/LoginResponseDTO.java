package com.quantum_beings.healthcare_platform.dto;

import com.quantum_beings.healthcare_platform.enums.Role;

public record LoginResponseDTO(
        String accessToken,
        String refreshToken,
        String tokenType,
        String email,
        Role role

){}
