package edu.vn.iuh.fit.authservice.repositories;

import edu.vn.iuh.fit.authservice.entities.DailyActiveStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface DailyActiveStatsRepository extends JpaRepository<DailyActiveStats, LocalDate> {
}
