package edu.vn.iuh.fit.authservice.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

// Bảng tổng hợp DAU/MAU của từng ngày (ghi bởi job cuối ngày), dùng cho thống kê xu hướng.
@Entity
@Table(name = "daily_active_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyActiveStats {

    @Id
    @Column(name = "stat_date")
    private LocalDate statDate;

    @Column(nullable = false)
    private long dau;

    // MAU rolling 30 ngày tính đến hết ngày statDate
    @Column(nullable = false)
    private long mau;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
