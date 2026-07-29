package com.example.learningservice.repositories;

import com.example.learningservice.entities.SessionItemMapping;
import com.example.learningservice.entities.SessionItemMappingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SessionItemMappingRepository extends JpaRepository<SessionItemMapping, SessionItemMappingId> {
    List<SessionItemMapping> findBySessionIdOrderByOrderIndexAsc(Long sessionId);
}
