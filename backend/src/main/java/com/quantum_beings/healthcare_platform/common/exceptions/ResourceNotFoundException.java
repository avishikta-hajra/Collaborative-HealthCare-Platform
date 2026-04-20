package com.quantum_beings.healthcare_platform.common.exceptions;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String message, Throwable cause) {

        super(message, cause, HttpStatus.NOT_FOUND);

    }

    public ResourceNotFoundException(String message) {
        super(message,HttpStatus.NOT_FOUND);

    }

}
