package edu.vn.iuh.fit.userservice.services;

import edu.vn.iuh.fit.userservice.dto.request.UserCreateRequest;
import edu.vn.iuh.fit.userservice.dto.request.UserUpdateRequest;
import edu.vn.iuh.fit.userservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.userservice.dto.response.UserCreateResponse;
import edu.vn.iuh.fit.userservice.dto.response.UserProfileResponse;

public interface UserService {
    UserCreateResponse createUser(UserCreateRequest request);

    UserAuthResponse checkUserExistsByEmail(String email);

    UserProfileResponse getProfile(Long userId, String email);

    UserProfileResponse updateProfile(Long userId, String email, UserUpdateRequest request);
}
