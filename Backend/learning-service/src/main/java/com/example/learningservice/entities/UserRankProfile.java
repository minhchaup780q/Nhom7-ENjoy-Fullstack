package com.example.learningservice.entities;

import com.example.learningservice.entities.enums.RankTier;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_rank_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRankProfile extends BaseEntity {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_rank", nullable = false, length = 30)
    @Builder.Default
    private RankTier currentRank = RankTier.BRONZE;

    @Column(name = "total_xp", nullable = false)
    @Builder.Default
    private Long totalXp = 0L;

    @Enumerated(EnumType.STRING)
    @Column(name = "highest_rank", nullable = false, length = 30)
    @Builder.Default
    private RankTier highestRank = RankTier.BRONZE;

    @Column(name = "top1_count", nullable = false)
    @Builder.Default
    private Integer top1Count = 0;

    @Column(name = "username", length = 100)
    private String username;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;
}
