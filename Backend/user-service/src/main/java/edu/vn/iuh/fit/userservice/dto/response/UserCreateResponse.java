package edu.vn.iuh.fit.userservice.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserCreateResponse {
    private String email;
}
