package com.opus.repo;

import com.opus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

@Query("SELECT u FROM User u JOIN u.role r WHERE u.verified = true AND r.name != 'ADMIN'")
	List<User> findVerifiedMaleUsers();
}
