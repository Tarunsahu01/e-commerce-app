package com.opus.controller;

import com.opus.dto.OfferEmailRequest;
import com.opus.entity.User;
import com.opus.repo.UserRepository;
import com.opus.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public AdminController(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/send-offer-email")
    public ResponseEntity<String> sendOfferEmail(@RequestBody OfferEmailRequest request) {
        List<User> maleUsers = userRepository.findVerifiedMaleUsers();
        emailService.sendBulkOffer(maleUsers, request.getSubject(), request.getMessage());
        return ResponseEntity.ok("Offer email sent successfully to " + maleUsers.size() + " users.");
    }
}
