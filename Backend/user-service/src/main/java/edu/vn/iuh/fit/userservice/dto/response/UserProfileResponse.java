package edu.vn.iuh.fit.userservice.dto.response;

import edu.vn.iuh.fit.userservice.entities.User;
import edu.vn.iuh.fit.userservice.entities.enums.UserRole;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private Long accountId;
    private String email;
    private String username;
    private String avatarUrl;
    private UserRole role;
    private Long parentId;
    private LocalDate birthday;
    private int dailyTimeLimit;
    private LocalDateTime createAt;

    public static UserProfileResponse fromEntity(User user) {
        if (user == null) return null;
        return UserProfileResponse.builder()
                .id(user.getId())
                .accountId(user.getAccountId())
                .email(user.getEmail())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .parentId(user.getParentId())
                .birthday(user.getBirthday())
                .dailyTimeLimit(user.getDailyTimeLimit())
                .createAt(user.getCreateAt())
                .build();
    }
}
