package edu.vn.iuh.fit.userservice.services.impl;

import edu.vn.iuh.fit.userservice.dto.request.UserCreateRequest;
import edu.vn.iuh.fit.userservice.dto.request.UserUpdateRequest;
import edu.vn.iuh.fit.userservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.userservice.dto.response.UserCreateResponse;
import edu.vn.iuh.fit.userservice.dto.response.UserProfileResponse;
import edu.vn.iuh.fit.userservice.entities.User;
import edu.vn.iuh.fit.userservice.entities.enums.UserRole;
import edu.vn.iuh.fit.userservice.repositories.UserRepository;
import edu.vn.iuh.fit.userservice.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserCreateResponse createUser(UserCreateRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại! Vui lòng nhập email khác");
        }

        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .accountId(request.getAccountId())
                .email(request.getEmail())
                .username(request.getUsername())
                .avatarUrl(request.getAvatarUrl())
                .birthday(request.getBirthday())
                .role(request.getRole())
                .createAt(now)
                .updateAt(now)
                .isDelete(false)
                .build();

        User savedUser = userRepository.save(user);

        return UserCreateResponse.builder()
                .id(savedUser.getId())
                .accountId(savedUser.getAccountId())
                .email(savedUser.getEmail())
                .username(savedUser.getUsername())
                .avatarUrl(savedUser.getAvatarUrl())
                .birthday(savedUser.getBirthday())
                .role(savedUser.getRole() != null ? savedUser.getRole().name() : null)
                .build();
    }

    @Override
    public UserAuthResponse checkUserExistsByEmail(String email) {

        User user = new User();

        if(userRepository.existsByEmail(email)){
            user = userRepository.findUsersByEmail(email);
        }else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Email chưa được đăng ký!");
        }

        return UserAuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId, String email) {
        User user = findUser(userId, email);
        return UserProfileResponse.fromEntity(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(Long userId, String email, UserUpdateRequest request) {
        User user = findUser(userId, email);

        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            user.setUsername(request.getUsername().trim());
        }
        if (request.getBirthday() != null) {
            user.setBirthday(request.getBirthday());
            // Tự động cập nhật loại tài khoản theo độ tuổi (nếu không phải ADMIN)
            if (user.getRole() != UserRole.ROLE_ADMIN) {
                int age = Period.between(request.getBirthday(), LocalDate.now()).getYears();
                if (age <= 16) {
                    user.setRole(UserRole.ROLE_CHILDREN);
                } else {
                    user.setRole(UserRole.ROLE_PARENT);
                }
            }
        }
        if (request.getAvatarUrl() != null && !request.getAvatarUrl().trim().isEmpty()) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }

        user.setUpdateAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        return UserProfileResponse.fromEntity(savedUser);
    }

    private User findUser(Long userId, String email) {
        if (userId != null) {
            return userRepository.findById(userId)
                    .orElseGet(() -> {
                        if (email != null && !email.trim().isEmpty() && userRepository.existsByEmail(email)) {
                            return userRepository.findUsersByEmail(email);
                        }
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng với ID: " + userId);
                    });
        }

        if (email != null && !email.trim().isEmpty() && userRepository.existsByEmail(email)) {
            return userRepository.findUsersByEmail(email);
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yêu cầu cung cấp User ID hoặc Email.");
    }
}
