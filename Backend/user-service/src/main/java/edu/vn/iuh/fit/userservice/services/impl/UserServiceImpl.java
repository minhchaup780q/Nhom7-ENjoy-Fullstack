package edu.vn.iuh.fit.userservice.services.impl;

import edu.vn.iuh.fit.userservice.dto.request.UserCreateRequest;
import edu.vn.iuh.fit.userservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.userservice.dto.response.UserCreateResponse;
import edu.vn.iuh.fit.userservice.entities.User;
import edu.vn.iuh.fit.userservice.entities.enums.UserRole;
import edu.vn.iuh.fit.userservice.repositories.UserRepository;
import edu.vn.iuh.fit.userservice.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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
//                .passwordHash(user.getPasswordHash())
                .build();
    }
}
