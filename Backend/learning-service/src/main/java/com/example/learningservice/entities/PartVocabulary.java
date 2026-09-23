package com.example.learningservice.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "part_vocabularies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PartVocabulary extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id", nullable = false)
    @JsonIgnoreProperties({"sessions", "hibernateLazyInitializer", "handler"})
    private Part part;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vocabulary_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Vocabulary vocabulary;

    @Column(name = "order_index")
    private Integer orderIndex;
}
