package edu.vn.iuh.fit.userservice.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyVerifyRequest {
    private String verificationCode;
}
