package com.opus.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.opus.dto.CheckoutRequest;
import com.opus.dto.StripeResponse;
import com.opus.service.PaymentCheckoutService;

@RestController
@RequestMapping("/api/payment")
public class PaymentCheckoutController {

	private PaymentCheckoutService paymentCheckoutService;
	
	
    public PaymentCheckoutController(PaymentCheckoutService paymentCheckoutService) {
		super();
		this.paymentCheckoutService = paymentCheckoutService;
	}

	@PostMapping("/checkout")
    public ResponseEntity<StripeResponse> checkout() {
		StripeResponse stripeResponse = paymentCheckoutService.checkout();
		return ResponseEntity.ok().body(stripeResponse);
    }
	
	@PostMapping("/success")
	public ResponseEntity<?> paymentSuccess(@RequestBody Map<String,String> req){

	    return ResponseEntity.ok(paymentCheckoutService.paymentSuccess(req));
	}
	
	@PostMapping("/cancel")
	public ResponseEntity<?> paymentCancel(@RequestBody Map<String,String> req){

	    return ResponseEntity.ok(paymentCheckoutService.paymentCancel(req));
	}

    
}
