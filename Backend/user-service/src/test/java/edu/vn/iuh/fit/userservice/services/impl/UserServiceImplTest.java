package edu.vn.iuh.fit.userservice.services.impl;

import edu.vn.iuh.fit.userservice.dto.request.UserCreateRequest;
import edu.vn.iuh.fit.userservice.dto.request.UserUpdateRequest;
import edu.vn.iuh.fit.userservice.dto.response.UserAuthResponse;
import edu.vn.iuh.fit.userservice.dto.response.UserCreateResponse;
import edu.vn.iuh.fit.userservice.dto.response.UserProfileResponse;
import edu.vn.iuh.fit.userservice.controllers.UserController;
import edu.vn.iuh.fit.userservice.entities.User;
import edu.vn.iuh.fit.userservice.entities.enums.UserRole;
import edu.vn.iuh.fit.userservice.exceptions.GlobalExceptionHandler;
import edu.vn.iuh.fit.userservice.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("User API behavior tests")
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    private MockMvc userApi() {
        return MockMvcBuilders.standaloneSetup(new UserController(userService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    /**
     * Verifies that a new email is persisted and returned as a created-user response.
     */
    @Test
    @DisplayName("TC44: Tạo người dùng thành công với email mới")
    void createUser_newEmail_returnsCreatedUserResponse() throws Exception {
        // Arrange
        UserCreateRequest request = UserCreateRequest.builder()
                .accountId(101L)
                .email("newuser@example.com")
                .username("New User")
                .avatarUrl("https://example.com/avatar.png")
                .birthday(LocalDate.of(2000, 1, 1))
                .role(UserRole.ROLE_PARENT)
                .build();
        Map<String, User> storedUsers = new HashMap<>();
        when(userRepository.existsByEmail(request.getEmail())).thenAnswer(invocation ->
                storedUsers.containsKey(invocation.getArgument(0)));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(1L);
            storedUsers.put(saved.getEmail(), saved);
            return saved;
        });

        MvcResult result = userApi().perform(post("/api/user/internal/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.accountId").value(101L))
                .andExpect(jsonPath("$.email").value("newuser@example.com"))
                .andExpect(jsonPath("$.username").value("New User"))
                .andExpect(jsonPath("$.role").value("ROLE_PARENT"))
                .andReturn();

        UserCreateResponse response = objectMapper.readValue(
                result.getResponse().getContentAsByteArray(), UserCreateResponse.class);
        assertThat(storedUsers).containsKey(response.getEmail());
        assertThat(storedUsers.get(response.getEmail()).getAccountId()).isEqualTo(101L);
    }

    /**
     * Verifies that creating a user with an existing email returns HTTP 400.
     */
    @Test
    @DisplayName("TC45: Từ chối tạo người dùng với email đã tồn tại")
    void createUser_duplicateEmail_throwsBadRequest400() throws Exception {
        // Arrange
        UserCreateRequest request = UserCreateRequest.builder()
                .accountId(202L)
                .email("existing@example.com")
                .username("Existing User")
                .role(UserRole.ROLE_PARENT)
                .build();
        Map<String, User> storedUsers = new HashMap<>();
        User existing = user(11L, "existing@example.com", "Existing User", UserRole.ROLE_PARENT);
        storedUsers.put(existing.getEmail(), existing);
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        userApi().perform(post("/api/user/internal/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email đã tồn tại! Vui lòng nhập email khác"));
        assertThat(storedUsers).containsOnlyKeys("existing@example.com");
        assertThat(storedUsers.get("existing@example.com").getUsername()).isEqualTo("Existing User");
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
