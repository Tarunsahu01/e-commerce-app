package com.opus.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.opus.entity.EmailOtp;

public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {

	Optional<EmailOtp> findTopByEmailOrderByIdDesc(String email);

}
