package com.example.learningservice.repositories;

import com.example.learningservice.entities.Tournament;
import com.example.learningservice.entities.enums.TournamentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    Optional<Tournament> findFirstByStatusOrderByStartDateDesc(TournamentStatus status);
    Optional<Tournament> findBySeasonCode(String seasonCode);
    Optional<Tournament> findFirstByStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatus(
            LocalDateTime now1, LocalDateTime now2, TournamentStatus status
    );
}
