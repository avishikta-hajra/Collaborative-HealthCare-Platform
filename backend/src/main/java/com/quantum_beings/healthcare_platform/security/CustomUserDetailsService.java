package com.quantum_beings.healthcare_platform.security;

import com.quantum_beings.healthcare_platform.entity.Account;
import com.quantum_beings.healthcare_platform.repository.AccountRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final AccountRepository accountRepository;
    public CustomUserDetailsService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String username) {

        Account account = accountRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("USER_NOT_FOUND"));
        return new CustomUserDetails(account);
    }
}
