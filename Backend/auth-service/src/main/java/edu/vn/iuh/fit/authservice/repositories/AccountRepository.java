package edu.vn.iuh.fit.authservice.repositories;

import edu.vn.iuh.fit.authservice.entities.Account;
import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByEmail(String email);
    boolean existsByEmail(String email);

    // Tài khoản đăng ký trong khoảng [from, to), loại ROLE_ADMIN và tài khoản đã xoá mềm.
    // Dùng để dựng cohort theo ngày đăng ký (createdAt).
    @Query("SELECT a FROM Account a WHERE a.role <> :adminRole " +
            "AND (a.isDelete = false OR a.isDelete IS NULL) " +
            "AND a.createdAt >= :from AND a.createdAt < :to")
    List<Account> findRegisteredBetween(@Param("adminRole") UserRole adminRole,
                                        @Param("from") LocalDateTime from,
                                        @Param("to") LocalDateTime to);
}
