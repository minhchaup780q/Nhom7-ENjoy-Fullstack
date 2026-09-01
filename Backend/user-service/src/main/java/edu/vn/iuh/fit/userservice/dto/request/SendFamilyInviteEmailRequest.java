package edu.vn.iuh.fit.userservice.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendFamilyInviteEmailRequest {
    private String recipient;
    private String parentName;
    private String otpCode;
}
