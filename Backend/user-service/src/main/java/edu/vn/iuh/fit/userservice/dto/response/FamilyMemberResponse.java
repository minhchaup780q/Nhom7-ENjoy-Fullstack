package edu.vn.iuh.fit.userservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberResponse {
    private Long id;
    private Long parentId;
    private String parentName;
    private String parentEmail;
    private String parentAvatarUrl;

    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentAvatarUrl;

    private String status;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
