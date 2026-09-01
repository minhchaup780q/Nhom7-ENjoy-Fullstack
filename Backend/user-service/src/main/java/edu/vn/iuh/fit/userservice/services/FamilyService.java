package edu.vn.iuh.fit.userservice.services;

import edu.vn.iuh.fit.userservice.dto.request.FamilyInviteRequest;
import edu.vn.iuh.fit.userservice.dto.request.FamilyVerifyRequest;
import edu.vn.iuh.fit.userservice.dto.response.FamilyMemberResponse;
import edu.vn.iuh.fit.userservice.dto.response.FamilyOverviewResponse;

public interface FamilyService {
    FamilyMemberResponse sendInvite(Long parentUserId, String parentEmail, FamilyInviteRequest request);
    FamilyMemberResponse verifyInvite(Long studentUserId, String studentEmail, FamilyVerifyRequest request);
    void rejectInvite(Long studentUserId, String studentEmail, Long familyId);
    void cancelOrRemoveLink(Long userId, String email, Long familyId);
    FamilyOverviewResponse getFamilyOverview(Long userId, String email);
}
