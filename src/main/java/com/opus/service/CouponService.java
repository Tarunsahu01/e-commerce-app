package com.opus.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.opus.dto.CouponRequest;
import com.opus.dto.CouponResponse;
import com.opus.entity.Category;
import com.opus.entity.Coupon;
import com.opus.exception.ResourceNotFoundException;
import com.opus.repo.CategoryRepository;
import com.opus.repo.CouponRepository;

@Service
public class CouponService {

	private CouponRepository couponRepository;
	private CategoryRepository categoryRepository;

	public CouponService(CouponRepository couponRepository, CategoryRepository categoryRepository) {
		this.couponRepository = couponRepository;
		this.categoryRepository = categoryRepository;
	}

	public CouponResponse createCoupon(CouponRequest request) {

		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		Coupon coupon = new Coupon();
		coupon.setCode(request.getCode());
		coupon.setDiscountPercentage(request.getDiscountPercentage());
		coupon.setExpiryDate(request.getExpiryDate());
		coupon.setCategory(category);
		coupon.setActive(true);

		Coupon saved = couponRepository.save(coupon);

		return mapToResponse(saved);
	}

	public List<CouponResponse> getAllCoupons() {

		return couponRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	private CouponResponse mapToResponse(Coupon coupon) {

		CouponResponse response = new CouponResponse();

		response.setId(coupon.getId());
		response.setCode(coupon.getCode());
		response.setDiscountPercentage(coupon.getDiscountPercentage());
		response.setExpiryDate(coupon.getExpiryDate());
		response.setActive(coupon.isActive());
		response.setCategoryName(coupon.getCategory().getName());

		return response;
	}

}
