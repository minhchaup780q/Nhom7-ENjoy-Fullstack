package edu.vn.iuh.fit.userservice.repositories;

import edu.vn.iuh.fit.userservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean findByEmail(String email);

    User findUsersByEmail(String email);
}
