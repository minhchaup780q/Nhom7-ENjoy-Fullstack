package edu.vn.iuh.fit.userservice.controllers;

import edu.vn.iuh.fit.userservice.dto.request.UserCreateRequest;
import edu.vn.iuh.fit.userservice.dto.request.UserUpdateRequest;
import edu.vn.iuh.fit.userservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.userservice.dto.response.UserCreateResponse;
import edu.vn.iuh.fit.userservice.dto.response.UserProfileResponse;
import edu.vn.iuh.fit.userservice.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/internal/create")
    public ResponseEntity<UserCreateResponse> createUser(@RequestBody UserCreateRequest userCreateRequest){
        UserCreateResponse response = userService.createUser(userCreateRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/internal/by-email")
    public ResponseEntity<UserAuthResponse> checkUser(@RequestParam("email") String email){
        UserAuthResponse response = userService.checkUserExistsByEmail(email);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/internal/count")
    public ResponseEntity<Long> countTotalUsers() {
        long count = userService.countTotalUsers();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @RequestParam(value = "userId", required = false) Long queryUserId,
            @RequestParam(value = "email", required = false) String queryEmail) {
        Long userId = headerUserId != null ? headerUserId : queryUserId;
        String email = headerEmail != null ? headerEmail : queryEmail;
        UserProfileResponse response = userService.getProfile(userId, email);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @RequestParam(value = "userId", required = false) Long queryUserId,
            @RequestParam(value = "email", required = false) String queryEmail,
            @RequestBody UserUpdateRequest request) {
        Long userId = headerUserId != null ? headerUserId : queryUserId;
        String email = headerEmail != null ? headerEmail : queryEmail;
        UserProfileResponse response = userService.updateProfile(userId, email, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/internal/activity/{userId}")
    public ResponseEntity<Void> updateActivity(@PathVariable("userId") Long userId) {
        userService.updateUserActivity(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/internal/roles/count")
    public ResponseEntity<java.util.Map<String, Long>> countUsersByRole() {
        return ResponseEntity.ok(userService.countUsersByRole());
    }

    @GetMapping("/internal/activity/stats")
    public ResponseEntity<java.util.Map<String, Long>> getParentActivityStats() {
        return ResponseEntity.ok(userService.getParentActivityStats());
    }
}
