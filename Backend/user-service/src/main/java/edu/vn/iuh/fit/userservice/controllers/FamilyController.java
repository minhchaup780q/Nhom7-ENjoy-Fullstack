package edu.vn.iuh.fit.userservice.controllers;

import edu.vn.iuh.fit.userservice.dto.request.FamilyInviteRequest;
import edu.vn.iuh.fit.userservice.dto.request.FamilyVerifyRequest;
import edu.vn.iuh.fit.userservice.dto.response.FamilyMemberResponse;
import edu.vn.iuh.fit.userservice.dto.response.FamilyOverviewResponse;
import edu.vn.iuh.fit.userservice.services.FamilyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/family")
@RequiredArgsConstructor
public class FamilyController {

    private final FamilyService familyService;

    @GetMapping("/overview")
    public ResponseEntity<FamilyOverviewResponse> getFamilyOverview(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @RequestParam(value = "userId", required = false) Long queryUserId,
            @RequestParam(value = "email", required = false) String queryEmail) {
        Long userId = headerUserId != null ? headerUserId : queryUserId;
        String email = headerEmail != null ? headerEmail : queryEmail;
        FamilyOverviewResponse response = familyService.getFamilyOverview(userId, email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/invite")
    public ResponseEntity<FamilyMemberResponse> sendInvite(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @RequestParam(value = "userId", required = false) Long queryUserId,
            @RequestParam(value = "email", required = false) String queryEmail,
            @RequestBody FamilyInviteRequest request) {
        Long userId = headerUserId != null ? headerUserId : queryUserId;
        String email = headerEmail != null ? headerEmail : queryEmail;
        FamilyMemberResponse response = familyService.sendInvite(userId, email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<FamilyMemberResponse> verifyInvite(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @RequestParam(value = "userId", required = false) Long queryUserId,
            @RequestParam(value = "email", required = false) String queryEmail,
            @RequestBody FamilyVerifyRequest request) {
        Long userId = headerUserId != null ? headerUserId : queryUserId;
        String email = headerEmail != null ? headerEmail : queryEmail;
        FamilyMemberResponse response = familyService.verifyInvite(userId, email, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reject/{familyId}")
    public ResponseEntity<Void> rejectInvite(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @RequestParam(value = "userId", required = false) Long queryUserId,
            @RequestParam(value = "email", required = false) String queryEmail,
            @PathVariable("familyId") Long familyId) {
        Long userId = headerUserId != null ? headerUserId : queryUserId;
        String email = headerEmail != null ? headerEmail : queryEmail;
        familyService.rejectInvite(userId, email, familyId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{familyId}")
    public ResponseEntity<Void> removeLink(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @RequestParam(value = "userId", required = false) Long queryUserId,
            @RequestParam(value = "email", required = false) String queryEmail,
            @PathVariable("familyId") Long familyId) {
        Long userId = headerUserId != null ? headerUserId : queryUserId;
        String email = headerEmail != null ? headerEmail : queryEmail;
        familyService.cancelOrRemoveLink(userId, email, familyId);
        return ResponseEntity.ok().build();
    }
}
