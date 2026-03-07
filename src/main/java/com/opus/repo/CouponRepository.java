package com.opus.repo;

import com.opus.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

	Optional<Coupon> findByCode(String code);

	List<Coupon> findByCategory_IdInAndActiveTrueAndExpiryDateGreaterThanEqual(
			Collection<Long> categoryIds, LocalDate date);
}