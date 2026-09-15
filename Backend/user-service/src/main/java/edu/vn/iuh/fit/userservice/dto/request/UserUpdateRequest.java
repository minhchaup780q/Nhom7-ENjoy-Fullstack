package edu.vn.iuh.fit.userservice.dto.request;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {
    private String username;
    private LocalDate birthday;
    private String avatarUrl;
}
