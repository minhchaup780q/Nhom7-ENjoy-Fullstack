package edu.vn.iuh.fit.authservice.dto.request;

import edu.vn.iuh.fit.authservice.entities.enums.UserRole;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreateRequest {
    private Long accountId;
    private String email;
    private String username;
    private String avatarUrl;
    private LocalDate birthday;
    private UserRole role;
}
