package com.opus.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.opus.dto.LoginRequest;
import com.opus.dto.MeResponse;
import com.opus.dto.OtpVerifyRequest;
import com.opus.dto.RegisterRequest;
import com.opus.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {

		return ResponseEntity.ok().body(authService.registerUser(request));
	}
	
	@PostMapping("/verify-otp")
	public String verifyOtp(@RequestBody OtpVerifyRequest request) {
	    return authService.verifyOtp(request);
	}

	@PostMapping("/login")
	public String login(@Valid @RequestBody LoginRequest request) {

		return authService.login(request);
	}

	@GetMapping("/me")
	public MeResponse me(Authentication authentication) {
		String email = authentication != null ? authentication.getName() : null;
		return authService.getCurrentUser(email);
	}
}