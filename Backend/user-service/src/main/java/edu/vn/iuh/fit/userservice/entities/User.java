package edu.vn.iuh.fit.userservice.entities;

import edu.vn.iuh.fit.userservice.entities.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    private String provider;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(name = "parent_id")
    private Long parentId;

    private LocalDateTime birthday;

    @Column(name = "daily_time_limit")
    private int dailyTimeLimit;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "create_by")
    private Long createBy;

    @Column(name = "update_by")
    private Long updateBy;

    @Column(name = "is_delete")
    private Boolean isDelete = false;

}
