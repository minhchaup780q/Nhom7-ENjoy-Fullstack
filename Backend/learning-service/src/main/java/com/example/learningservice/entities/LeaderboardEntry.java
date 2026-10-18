package com.example.learningservice.entities;

import com.example.learningservice.entities.enums.RankTier;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "leaderboard_entries",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_tournament_user", columnNames = {"tournament_id", "user_id"})
    },
    indexes = {
        @Index(name = "idx_leaderboard_query", columnList = "tournament_id, rank_tier, weekly_xp, last_xp_updated_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEntry extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Tournament tournament;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "rank_tier", nullable = false, length = 30)
    private RankTier rankTier;

    @Column(name = "weekly_xp", nullable = false)
    @Builder.Default
    private Integer weeklyXp = 0;

    @Column(name = "last_xp_updated_at")
    private LocalDateTime lastXpUpdatedAt;
}
