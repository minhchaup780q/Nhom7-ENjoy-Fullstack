package edu.vn.iuh.fit.userservice.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class UserAuthResponse {
    private Long id;
    private String email;
    private String role;
//    private String passwordHash;
}
