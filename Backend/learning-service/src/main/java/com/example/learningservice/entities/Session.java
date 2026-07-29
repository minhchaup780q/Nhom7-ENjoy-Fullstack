package com.example.learningservice.entities;

import com.example.learningservice.entities.enums.SessionStatus;
import com.example.learningservice.entities.enums.SessionType;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Session extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id")
    private Part part;

    @Enumerated(EnumType.STRING)
    @Column(name = "session_type")
    private SessionType sessionType;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    @Column(name = "badge_id")
    private Long badgeId; // Service Gamification quản lý

    private String title;
    private String keyword;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "order_index")
    private Integer orderIndex;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<SessionItemMapping> itemMappings;
}