package com.example.learningservice.entities;

import com.example.learningservice.entities.enums.TournamentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tournaments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tournament extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "season_code", nullable = false, unique = true, length = 50)
    private String seasonCode; // Ví dụ: "2026_W42"

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate; // Thứ 2 00:00:00

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate; // Chủ Nhật 23:59:59

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TournamentStatus status; // ACTIVE, FINISHED
}
