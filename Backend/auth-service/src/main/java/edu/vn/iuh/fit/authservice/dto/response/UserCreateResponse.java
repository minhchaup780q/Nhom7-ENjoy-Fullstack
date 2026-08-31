package edu.vn.iuh.fit.authservice.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreateResponse {
    private Long id;
    private Long accountId;
    private String email;
    private String username;
    private String avatarUrl;
    private LocalDate birthday;
    private String role;
}
