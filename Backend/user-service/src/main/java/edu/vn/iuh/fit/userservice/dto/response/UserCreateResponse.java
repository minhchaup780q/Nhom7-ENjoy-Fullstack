package edu.vn.iuh.fit.userservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
// Test xem không có 2 field dưới đây thì Builder có ngủm không 😁😁😁
// @NoArgsConstructor
// @AllArgsConstructor
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
