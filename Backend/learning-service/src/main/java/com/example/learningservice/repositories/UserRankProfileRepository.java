package com.example.learningservice.repositories;

import com.example.learningservice.entities.UserRankProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRankProfileRepository extends JpaRepository<UserRankProfile, Long> {
    Optional<UserRankProfile> findByUserId(Long userId);
}
