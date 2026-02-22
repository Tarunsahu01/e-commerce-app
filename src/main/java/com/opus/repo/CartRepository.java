package com.opus.repo;

import com.opus.entity.Cart;
import com.opus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

	Optional<Cart> findByUser(User user);
}