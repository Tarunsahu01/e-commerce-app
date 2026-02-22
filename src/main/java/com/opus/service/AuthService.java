package com.opus.service;

import com.opus.dto.LoginRequest;
import com.opus.dto.RegisterRequest;
import com.opus.entity.Role;
import com.opus.entity.User;
import com.opus.exception.ResourceNotFoundException;
import com.opus.repo.RoleRepository;
import com.opus.repo.UserRepository;
import com.opus.security.JwtUtil;

import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final AuthenticationManager authenticationManager;
	private final PasswordEncoder passwordEncoder;
	private JwtUtil jwtUtil;

	public AuthService(UserRepository userRepository, RoleRepository roleRepository,
			AuthenticationManager authenticationManager, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {

		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
		this.passwordEncoder = passwordEncoder;
	}

	public String registerUser(RegisterRequest request) {
		if (userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new RuntimeException("Email already registered");
		}

		Role userRole = roleRepository.findByName("USER")
				.orElseThrow(() -> new ResourceNotFoundException("Role USER not found"));

		User user = new User();
		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(userRole);

		userRepository.save(user);
		return "User registered successfully";
	}

	public String login(LoginRequest request) {

		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		return jwtUtil.generateToken(request.getEmail());
	}
}