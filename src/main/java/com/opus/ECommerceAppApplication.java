package com.opus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ECommerceAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(ECommerceAppApplication.class, args);
		
		System.out.println("HASHED PASSWORD: " + new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("Admin@123"));
	}
	
	

}
