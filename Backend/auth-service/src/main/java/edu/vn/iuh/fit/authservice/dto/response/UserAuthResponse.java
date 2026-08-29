package edu.vn.iuh.fit.authservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserAuthResponse {
    private Long id;
    private String email;
    private String role;
    private String passwordHash;
}
