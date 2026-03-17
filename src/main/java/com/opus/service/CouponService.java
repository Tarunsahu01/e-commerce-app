package com.opus.service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.opus.dto.ApplicableCouponsRequest;
import com.opus.dto.CouponRequest;
import com.opus.dto.CouponResponse;
import com.opus.dto.UpdateCouponRequest;
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

	public List<CouponResponse> getApplicableCoupons(ApplicableCouponsRequest request) {
		List<Long> categoryIds = request != null ? request.getCategories() : null;
		if (categoryIds == null || categoryIds.isEmpty()) {
			return Collections.emptyList();
		}
		LocalDate today = LocalDate.now();
		return couponRepository
				.findByCategory_IdInAndActiveTrueAndExpiryDateGreaterThanEqual(categoryIds, today)
				.stream()
				.map(this::mapToResponse)
				.toList();
	}

	public CouponResponse updateCoupon(Long id, UpdateCouponRequest request) {

		Coupon coupon = couponRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

		if (request.getDiscountPercentage() != null) {
			coupon.setDiscountPercentage(request.getDiscountPercentage());
		}
		if (request.getActive() != null) {
			coupon.setActive(request.getActive());
		}

		Coupon saved = couponRepository.save(coupon);

		return mapToResponse(saved);
	}

	public void deleteCoupon(Long id) {

		Coupon coupon = couponRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

		couponRepository.delete(coupon);
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
