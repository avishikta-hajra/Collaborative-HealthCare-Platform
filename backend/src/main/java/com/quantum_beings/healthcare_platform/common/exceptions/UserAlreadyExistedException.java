package com.quantum_beings.healthcare_platform.common.exceptions;

import org.springframework.http.HttpStatus;

public class UserAlreadyExistedException extends ApiException {



    public UserAlreadyExistedException(String message, HttpStatus status) {
        super(message, HttpStatus.BAD_REQUEST);

    }

    public UserAlreadyExistedException(String message, Throwable cause, HttpStatus status) {
        super(message, cause, HttpStatus.BAD_REQUEST);
    }
}

