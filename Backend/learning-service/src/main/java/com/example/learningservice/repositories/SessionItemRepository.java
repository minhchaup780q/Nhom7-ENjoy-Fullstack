package com.example.learningservice.repositories;

import com.example.learningservice.entities.SessionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionItemRepository extends JpaRepository<SessionItem, Long> {
    Optional<SessionItem> findByIdAndIsDeleteFalse(Long id);
    List<SessionItem> findByIsDeleteFalse();
}
