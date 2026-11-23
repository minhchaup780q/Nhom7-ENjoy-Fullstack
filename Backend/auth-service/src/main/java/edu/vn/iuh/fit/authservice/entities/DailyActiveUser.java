package edu.vn.iuh.fit.authservice.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

// Mỗi dòng = 1 tài khoản có hoạt động (đăng nhập / refresh token) trong 1 ngày.
// Cần lưu chi tiết theo account để tính MAU unique (rolling 30 ngày) chính xác.
@Entity
@Table(
        name = "daily_active_user",
        uniqueConstraints = @UniqueConstraint(name = "uk_dau_date_account", columnNames = {"stat_date", "account_id"}),
        indexes = @Index(name = "idx_dau_stat_date", columnList = "stat_date")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyActiveUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stat_date", nullable = false)
    private LocalDate statDate;

    @Column(name = "account_id", nullable = false)
    private Long accountId;
}
