package com.opus.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.opus.dto.ApplicableCouponsRequest;
import com.opus.dto.CouponRequest;
import com.opus.dto.CouponResponse;
import com.opus.service.CouponService;

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

	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@GetMapping
	public List<CouponResponse> getCoupons() {
		return couponService.getAllCoupons();
	}

	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@PostMapping("/applicable")
	public List<CouponResponse> getApplicableCoupons(@RequestBody ApplicableCouponsRequest request) {
		return couponService.getApplicableCoupons(request);
	}
}