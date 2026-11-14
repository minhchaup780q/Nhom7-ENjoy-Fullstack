package edu.vn.iuh.fit.userservice.services.impl;

import edu.vn.iuh.fit.userservice.dto.request.UserCreateRequest;
import edu.vn.iuh.fit.userservice.dto.request.UserUpdateRequest;
import edu.vn.iuh.fit.userservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.userservice.dto.response.UserCreateResponse;
import edu.vn.iuh.fit.userservice.dto.response.UserProfileResponse;
import edu.vn.iuh.fit.userservice.entities.User;
import edu.vn.iuh.fit.userservice.entities.enums.UserRole;
import edu.vn.iuh.fit.userservice.repositories.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("User Service Unit Tests")
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    /**
     * Verifies that a new email is persisted and returned as a created-user response.
     */
    @Test
    @DisplayName("createUser: Tạo người dùng thành công với email mới")
    void createUser_newEmail_returnsCreatedUserResponse() {
        // Arrange
        UserCreateRequest request = UserCreateRequest.builder()
                .accountId(101L)
                .email("newuser@example.com")
                .username("New User")
                .avatarUrl("https://example.com/avatar.png")
                .birthday(LocalDate.of(2000, 1, 1))
                .role(UserRole.ROLE_PARENT)
                .build();
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        // Act
        UserCreateResponse response = userService.createUser(request);

        // Assert
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getAccountId()).isEqualTo(101L);
        assertThat(response.getEmail()).isEqualTo("newuser@example.com");
        assertThat(response.getUsername()).isEqualTo("New User");
        assertThat(response.getRole()).isEqualTo("ROLE_PARENT");
        verify(userRepository).save(any(User.class));
    }

    /**
     * Verifies that creating a user with an existing email returns HTTP 400.
     */
    @Test
    @DisplayName("createUser: Từ chối tạo người dùng với email đã tồn tại")
    void createUser_duplicateEmail_throwsBadRequest400() {
        // Arrange
        UserCreateRequest request = UserCreateRequest.builder()
                .email("existing@example.com")
                .username("Existing User")
                .role(UserRole.ROLE_PARENT)
                .build();
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> userService.createUser(request))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception -> {
                    assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(exception.getReason())
                            .isEqualTo("Email đã tồn tại! Vui lòng nhập email khác");
                    assertThat(exception.getMessage())
                            .contains("Email đã tồn tại! Vui lòng nhập email khác");
                });
        verify(userRepository).existsByEmail(request.getEmail());
        verify(userRepository, org.mockito.Mockito.never()).save(any(User.class));
    }

    /**
     * Verifies that looking up a known email returns its authentication profile.
     */
    @Test
    @DisplayName("checkUserExistsByEmail: Trả thông tin xác thực khi email đã tồn tại")
    void checkUserExistsByEmail_existingEmail_returnsUserAuthResponse() {
        // Arrange
        String email = "known@example.com";
        User user = user(11L, email, "Known User", UserRole.ROLE_PARENT);
        when(userRepository.existsByEmail(email)).thenReturn(true);
        when(userRepository.findUsersByEmail(email)).thenReturn(user);

        // Act
        UserAuthResponse response = userService.checkUserExistsByEmail(email);

        // Assert
        assertThat(response.getId()).isEqualTo(11L);
        assertThat(response.getEmail()).isEqualTo(email);
        assertThat(response.getUsername()).isEqualTo("Known User");
        assertThat(response.getRole()).isEqualTo("ROLE_PARENT");
    }

    /**
     * Verifies that looking up an unknown email returns HTTP 404.
     */
    @Test
    @DisplayName("checkUserExistsByEmail: Báo lỗi khi email chưa đăng ký")
    void checkUserExistsByEmail_unknownEmail_throwsNotFound404() {
        // Arrange
        String email = "unknown@example.com";
        when(userRepository.existsByEmail(email)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> userService.checkUserExistsByEmail(email))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception -> {
                    assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(exception.getReason()).isEqualTo("Email chưa được đăng ký!");
                    assertThat(exception.getMessage()).contains("Email chưa được đăng ký!");
                });
    }

    /**
     * Verifies that a profile can be retrieved by user ID.
     */
    @Test
    @DisplayName("getProfile: Lấy hồ sơ theo userId")
    void getProfile_byUserId_returnsUserProfileResponse() {
        // Arrange
        User user = user(12L, "profile@example.com", "Profile User", UserRole.ROLE_PARENT);
        when(userRepository.findById(12L)).thenReturn(Optional.of(user));

        // Act
        UserProfileResponse response = userService.getProfile(12L, null);

        // Assert
        assertThat(response.getId()).isEqualTo(12L);
        assertThat(response.getEmail()).isEqualTo("profile@example.com");
        assertThat(response.getUsername()).isEqualTo("Profile User");
        assertThat(response.getRole()).isEqualTo(UserRole.ROLE_PARENT);
    }

    /**
     * Verifies that profile lookup falls back to email when the supplied ID is unknown.
     */
    @Test
    @DisplayName("getProfile: Tìm hồ sơ theo email khi userId không tồn tại")
    void getProfile_userIdNotFound_fallsBackToEmailLookup() {
        // Arrange
        String email = "fallback@example.com";
        User user = user(13L, email, "Fallback User", UserRole.ROLE_CHILDREN);
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        when(userRepository.existsByEmail(email)).thenReturn(true);
        when(userRepository.findUsersByEmail(email)).thenReturn(user);

        // Act
        UserProfileResponse response = userService.getProfile(999L, email);

        // Assert
        assertThat(response.getId()).isEqualTo(13L);
        assertThat(response.getEmail()).isEqualTo(email);
        verify(userRepository).findUsersByEmail(email);
    }

    /**
     * Verifies that profile lookup with neither ID nor email returns HTTP 400.
     */
    @Test
    @DisplayName("getProfile: Báo lỗi khi thiếu cả userId và email")
    void getProfile_nullUserIdAndNullEmail_throwsBadRequest400() {
        // Arrange
        // No ID or email is supplied.

        // Act & Assert
        assertThatThrownBy(() -> userService.getProfile(null, null))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception -> {
                    assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(exception.getReason()).isEqualTo("Yêu cầu cung cấp User ID hoặc Email.");
                    assertThat(exception.getMessage()).contains("Yêu cầu cung cấp User ID hoặc Email.");
                });
        verifyNoInteractions(userRepository);
    }

    /**
     * Verifies that updating only the username preserves other profile fields.
     */
    @Test
    @DisplayName("updateProfile: Chỉ cập nhật username hợp lệ")
    void updateProfile_validUsername_updatesUsernameOnly() {
        // Arrange
        User user = user(14L, "update@example.com", "Old Name", UserRole.ROLE_PARENT);
        user.setBirthday(LocalDate.of(1995, 5, 5));
        user.setAvatarUrl("old-avatar.png");
        when(userRepository.findById(14L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        UserUpdateRequest request = UserUpdateRequest.builder()
                .username("  Updated Name  ")
                .build();

        // Act
        UserProfileResponse response = userService.updateProfile(14L, null, request);

        // Assert
        assertThat(response.getUsername()).isEqualTo("Updated Name");
        assertThat(user.getBirthday()).isEqualTo(LocalDate.of(1995, 5, 5));
        assertThat(user.getAvatarUrl()).isEqualTo("old-avatar.png");
        assertThat(user.getRole()).isEqualTo(UserRole.ROLE_PARENT);
        assertThat(user.getUpdateAt()).isNotNull();
        verify(userRepository).save(user);
    }

    /**
     * Verifies that a 17-year-old user is assigned the parent role.
     */
    @Test
    @DisplayName("updateProfile: Người dùng 17 tuổi được gán role parent")
    void updateProfile_birthday17YrsOld_setsRoleParent() {
        // Arrange
        User user = user(15L, "seventeen@example.com", "Seventeen", UserRole.ROLE_CHILDREN);
        LocalDate birthday = LocalDate.now().minusYears(17);
        when(userRepository.findById(15L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        UserUpdateRequest request = UserUpdateRequest.builder()
                .birthday(birthday)
                .build();

        // Act
        UserProfileResponse response = userService.updateProfile(15L, null, request);

        // Assert
        assertThat(response.getBirthday()).isEqualTo(birthday);
        assertThat(response.getRole()).isEqualTo(UserRole.ROLE_PARENT);
    }

    /**
     * Verifies that updating an admin's birthday does not change the admin role.
     */
    @Test
    @DisplayName("updateProfile: Giữ nguyên role admin khi cập nhật ngày sinh")
    void updateProfile_adminRole_doesNotChangeRole() {
        // Arrange
        User user = user(16L, "admin@example.com", "Admin", UserRole.ROLE_ADMIN);
        when(userRepository.findById(16L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        UserUpdateRequest request = UserUpdateRequest.builder()
                .birthday(LocalDate.now().minusYears(10))
                .build();

        // Act
        UserProfileResponse response = userService.updateProfile(16L, null, request);

        // Assert
        assertThat(response.getRole()).isEqualTo(UserRole.ROLE_ADMIN);
        assertThat(response.getBirthday()).isEqualTo(request.getBirthday());
    }

    /**
     * Verifies that updating activity sets lastActiveAt and saves an existing user.
     */
    @Test
    @DisplayName("updateUserActivity: Cập nhật thời gian hoạt động người dùng")
    void updateUserActivity_existingUser_updatesLastActiveAt() {
        // Arrange
        User user = user(17L, "active@example.com", "Active User", UserRole.ROLE_PARENT);
        when(userRepository.findById(17L)).thenReturn(Optional.of(user));

        // Act
        userService.updateUserActivity(17L);

        // Assert
        assertThat(user.getLastActiveAt()).isNotNull();
        verify(userRepository).save(user);
    }

    /**
     * Verifies that user counts always contain parent and children role keys.
     */
    @Test
    @DisplayName("countUsersByRole: Trả số lượng parent và children")
    void countUsersByRole_always_returnMapWithParentsAndChildren() {
        // Arrange
        when(userRepository.countByRole(UserRole.ROLE_PARENT)).thenReturn(8L);
        when(userRepository.countByRole(UserRole.ROLE_CHILDREN)).thenReturn(5L);

        // Act
        Map<String, Long> counts = userService.countUsersByRole();

        // Assert
        assertThat(counts).containsEntry("parents", 8L)
                .containsEntry("children", 5L)
                .hasSize(2);
    }

    /**
     * Verifies that parent activity statistics always include active, inactive, and dormant counts.
     */
    @Test
    @DisplayName("getParentActivityStats: Trả đủ số liệu active, inactive và dormant")
    void getParentActivityStats_always_returnsActiveInactiveDormantKeys() {
        // Arrange
        when(userRepository.countByRoleAndLastActiveAtAfter(eq(UserRole.ROLE_PARENT), any(LocalDateTime.class)))
                .thenReturn(10L);
        when(userRepository.countByRoleAndLastActiveAtBetween(
                eq(UserRole.ROLE_PARENT), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(4L);
        when(userRepository.countByRoleAndLastActiveAtBeforeOrNull(
                eq(UserRole.ROLE_PARENT), any(LocalDateTime.class)))
                .thenReturn(2L);

        // Act
        Map<String, Long> stats = userService.getParentActivityStats();

        // Assert
        assertThat(stats).containsEntry("active", 10L)
                .containsEntry("inactive", 4L)
                .containsEntry("dormant", 2L)
                .hasSize(3);
    }

    private User user(Long id, String email, String username, UserRole role) {
        return User.builder()
                .id(id)
                .accountId(id + 100)
                .email(email)
                .username(username)
                .role(role)
                .isDelete(false)
                .createAt(LocalDateTime.now())
                .build();
    }
}
