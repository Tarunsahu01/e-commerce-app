package com.opus.dto;

public class OfferEmailRequest {
    private String subject;
    private String message;

    // Default constructor
    public OfferEmailRequest() {}

    public OfferEmailRequest(String subject, String message) {
        this.subject = subject;
        this.message = message;
    }

    // Getters and Setters
    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
