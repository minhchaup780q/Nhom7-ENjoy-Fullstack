package edu.vn.iuh.fit.userservice.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyOverviewResponse {
    private List<FamilyMemberResponse> linkedMembers;
    private List<FamilyMemberResponse> pendingInvites;
}
