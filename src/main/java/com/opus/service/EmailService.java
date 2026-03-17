package com.opus.service;

import java.util.List;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.opus.entity.Order;
import com.opus.entity.OrderItem;

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

    public void sendOrderConfirmation(String to, Order order, List<OrderItem> items) {
        if (to == null || to.isBlank() || order == null) return;

        StringBuilder body = new StringBuilder();
        body.append("Hello,\n\n");
        body.append("Your order has been placed successfully.\n\n");
        body.append("Order ID: ").append(order.getId()).append("\n");
        body.append("Total Amount: ₹").append(order.getTotalAmount() != null ? order.getTotalAmount() : 0).append("\n\n");
        body.append("Products:\n");

        if (items != null && !items.isEmpty()) {
            for (OrderItem it : items) {
                String productName = it.getProduct() != null ? it.getProduct().getName() : "Product";
                int qty = it.getQuantity() != null ? it.getQuantity() : 0;
                double price = it.getPriceAtTime() != null ? it.getPriceAtTime() : 0.0;
                body.append("- ").append(productName)
                    .append(" | Qty: ").append(qty)
                    .append(" | Price: ₹").append(price)
                    .append("\n");
            }
        } else {
            body.append("- (No items found)\n");
        }

        body.append("\nThank you for shopping with us.\n");
        body.append("\nBest regards,\nE-commerce Team");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("E-commerce website <pranavedu16@gmail.com>");
        message.setTo(to);
        message.setSubject("Order Confirmation - Order #" + order.getId());
        message.setText(body.toString());

        mailSender.send(message);
    }
}
