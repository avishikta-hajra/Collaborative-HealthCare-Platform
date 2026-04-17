package com.quantum_beings.healthcare_platform.entity;


import com.quantum_beings.healthcare_platform.enums.AccountStatus;
import com.quantum_beings.healthcare_platform.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountStatus status = AccountStatus.ACTIVE;


    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }


}
