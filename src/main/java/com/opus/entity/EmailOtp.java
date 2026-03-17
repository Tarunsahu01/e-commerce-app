package com.opus.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_otps")
public class EmailOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String otp;

    private LocalDateTime expiryTime;

    private boolean used = false;

    public EmailOtp() {}

    public Long getId() { return id; }

    public String getEmail() { return email; }

    public String getOtp() { return otp; }

    public LocalDateTime getExpiryTime() { return expiryTime; }

    public boolean isUsed() { return used; }

    public void setEmail(String email) { this.email = email; }

    public void setOtp(String otp) { this.otp = otp; }

    public void setExpiryTime(LocalDateTime expiryTime) { this.expiryTime = expiryTime; }

    public void setUsed(boolean used) { this.used = used; }
}