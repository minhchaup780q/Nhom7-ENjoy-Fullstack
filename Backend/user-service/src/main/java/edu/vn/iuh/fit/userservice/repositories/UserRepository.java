package edu.vn.iuh.fit.userservice.repositories;

import edu.vn.iuh.fit.userservice.entities.User;
import edu.vn.iuh.fit.userservice.entities.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean findByEmail(String email);

    User findUsersByEmail(String email);

    long countByRole(UserRole role);

    long countByRoleAndLastActiveAtAfter(UserRole role, LocalDateTime time);

    long countByRoleAndLastActiveAtBetween(UserRole role, LocalDateTime startTime, LocalDateTime endTime);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND (u.lastActiveAt < :time OR u.lastActiveAt IS NULL)")
    long countByRoleAndLastActiveAtBeforeOrNull(@Param("role") UserRole role, @Param("time") LocalDateTime time);
}
