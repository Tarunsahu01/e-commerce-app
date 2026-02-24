package com.opus.controller;

import com.opus.dto.*;
import com.opus.service.CouponService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

	private CouponService couponService;

	public CouponController(CouponService couponService) {
		this.couponService = couponService;
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping
	public CouponResponse createCoupon(@RequestBody CouponRequest request) {

		return couponService.createCoupon(request);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public List<CouponResponse> getCoupons() {
		return couponService.getAllCoupons();
	}
}