package edu.vn.iuh.fit.authservice.repositories;

import edu.vn.iuh.fit.authservice.entities.DailyActiveUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyActiveUserRepository extends JpaRepository<DailyActiveUser, Long> {

    @Query("SELECT d.accountId FROM DailyActiveUser d WHERE d.statDate = :date")
    List<Long> findAccountIdsByStatDate(@Param("date") LocalDate date);

    @Query("SELECT DISTINCT d.accountId FROM DailyActiveUser d WHERE d.statDate BETWEEN :from AND :to")
    List<Long> findDistinctAccountIdsBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT COUNT(DISTINCT d.accountId) FROM DailyActiveUser d WHERE d.statDate BETWEEN :from AND :to")
    long countDistinctAccountIdsBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
