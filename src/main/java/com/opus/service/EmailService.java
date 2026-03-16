package com.opus.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String to, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("E-commerce website <pranavedu16@gmail.com>");
        message.setTo(to);
        message.setSubject("Your Registration Verification Code");

        message.setText(
                "Hello,\n\nYour verification code for registration is: " + otp +
                "\n\nThis code is valid for 5 minutes." +
                "\nIf you did not request this, please ignore this email." +
                "\n\nBest regards,\nE-commerce Team"
        );

        mailSender.send(message);
    }
}
