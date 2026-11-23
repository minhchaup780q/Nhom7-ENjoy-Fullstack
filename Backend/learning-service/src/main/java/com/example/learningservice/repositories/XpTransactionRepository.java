package com.example.learningservice.repositories;

import com.example.learningservice.entities.XpTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface XpTransactionRepository extends JpaRepository<XpTransaction, Long> {
    List<XpTransaction> findByUserIdOrderByCreateAtDesc(Long userId);
}
