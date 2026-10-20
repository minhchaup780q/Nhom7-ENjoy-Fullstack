package com.example.learningservice.repositories;

import com.example.learningservice.entities.LeaderboardEntry;
import com.example.learningservice.entities.enums.RankTier;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeaderboardEntryRepository extends JpaRepository<LeaderboardEntry, Long> {

    Optional<LeaderboardEntry> findByTournamentIdAndUserId(Long tournamentId, Long userId);

    List<LeaderboardEntry> findByTournamentIdAndRankTierOrderByWeeklyXpDescLastXpUpdatedAtAsc(
            Long tournamentId, RankTier rankTier, Pageable pageable
    );

    List<LeaderboardEntry> findByTournamentIdAndRankTierOrderByWeeklyXpDescLastXpUpdatedAtAsc(
            Long tournamentId, RankTier rankTier
    );

    /**
     * Đếm số người có thứ hạng cao hơn user này (có điểm cao hơn, hoặc bằng điểm nhưng cập nhật trước)
     */
    @Query("SELECT COUNT(e) FROM LeaderboardEntry e WHERE e.tournament.id = :tournamentId " +
           "AND e.rankTier = :rankTier " +
           "AND (e.weeklyXp > :weeklyXp OR (e.weeklyXp = :weeklyXp AND e.lastXpUpdatedAt < :lastUpdated))")
    long countHigherRankUsers(
            @Param("tournamentId") Long tournamentId,
            @Param("rankTier") RankTier rankTier,
            @Param("weeklyXp") Integer weeklyXp,
            @Param("lastUpdated") LocalDateTime lastUpdated
    );
}
