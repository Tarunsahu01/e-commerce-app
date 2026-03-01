package com.opus.controller;

import com.opus.dto.MeResponse;
import com.opus.dto.LoginRequest;
import com.opus.dto.RegisterRequest;
import com.opus.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public String register(@Valid @RequestBody RegisterRequest request) {

		return authService.registerUser(request);
	}

	@PostMapping("/login")
	public String login(@Valid @RequestBody LoginRequest request) {

		return authService.login(request);
	}

	@GetMapping("/me")
	public MeResponse me() {
		return authService.getCurrentUser();
	}
}