package com.opus.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * Request body for fetching coupons applicable to given category IDs.
 * Example: { "categories": [1, 3, 5] }
 */
public class ApplicableCouponsRequest {

	@NotNull
	private List<Long> categories;

	public ApplicableCouponsRequest() {
	}

	public List<Long> getCategories() {
		return categories;
	}

	public void setCategories(List<Long> categories) {
		this.categories = categories;
	}
}
