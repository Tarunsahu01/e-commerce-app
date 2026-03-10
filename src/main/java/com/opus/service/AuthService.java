package com.opus.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.opus.dto.LoginRequest;
import com.opus.dto.MeResponse;
import com.opus.dto.OtpVerifyRequest;
import com.opus.dto.RegisterRequest;
import com.opus.entity.EmailOtp;
import com.opus.entity.Role;
import com.opus.entity.User;
import com.opus.exception.ResourceNotFoundException;
import com.opus.repo.EmailOtpRepository;
import com.opus.repo.RoleRepository;
import com.opus.repo.UserRepository;
import com.opus.security.JwtUtil;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final AuthenticationManager authenticationManager;
	private final PasswordEncoder passwordEncoder;
	private final EmailOtpRepository emailOtpRepository;
	private final EmailService emailService;
	private JwtUtil jwtUtil;

	public AuthService(UserRepository userRepository, RoleRepository roleRepository,
			AuthenticationManager authenticationManager, JwtUtil jwtUtil, PasswordEncoder passwordEncoder,
			EmailOtpRepository emailOtpRepository, EmailService emailService) {

		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
		this.passwordEncoder = passwordEncoder;
		this.emailOtpRepository = emailOtpRepository;
		this.emailService = emailService;
	}

	public String registerUser(RegisterRequest request) {

		Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());

		Role userRole = roleRepository.findByName("USER")
				.orElseThrow(() -> new ResourceNotFoundException("Role USER not found"));

		User user;

		if (existingUserOpt.isPresent()) {

			user = existingUserOpt.get();

			// If already verified → block registration
			if (user.isVerified()) {
				throw new RuntimeException("Email already registered");
			}

			// If NOT verified → update details and resend OTP
			user.setName(request.getName());
			user.setPassword(passwordEncoder.encode(request.getPassword()));
			user.setRole(userRole);

		} else {

			// New user registration
			user = new User();
			user.setName(request.getName());
			user.setEmail(request.getEmail());
			user.setPassword(passwordEncoder.encode(request.getPassword()));
			user.setRole(userRole);
			user.setVerified(false);
		}

		userRepository.save(user);

		// Generate OTP
		String otp = String.valueOf((int) ((Math.random() * 900000) + 100000));

		EmailOtp emailOtp = new EmailOtp();
		emailOtp.setEmail(user.getEmail());
		emailOtp.setOtp(otp);
		emailOtp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

		emailOtpRepository.save(emailOtp);

		emailService.sendOtp(user.getEmail(), otp);

		return "OTP sent to email";
	}

	public String verifyOtp(OtpVerifyRequest request) {

		EmailOtp emailOtp = emailOtpRepository.findTopByEmailOrderByIdDesc(request.getEmail())
				.orElseThrow(() -> new RuntimeException("OTP not found"));

		if (emailOtp.isUsed()) {
			throw new RuntimeException("OTP already used");
		}

		if (!emailOtp.getOtp().equals(request.getOtp())) {
			throw new RuntimeException("Invalid OTP");
		}

		if (emailOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("OTP expired");
		}

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));

		user.setVerified(true);

		userRepository.save(user);

		emailOtp.setUsed(true);
		emailOtpRepository.save(emailOtp);

		return "Email verified successfully";
	}

	public String login(LoginRequest request) {

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User with email " + request.getEmail() + " does not exists"));

		if (!user.isVerified()) {
			throw new RuntimeException("Email not verified");
		}

		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		return jwtUtil.generateToken(request.getEmail());
	}

	public MeResponse getCurrentUser(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		String roleName = user.getRole() != null ? user.getRole().getName() : "USER";
		return new MeResponse(user.getName(), user.getEmail(), roleName);
	}
}