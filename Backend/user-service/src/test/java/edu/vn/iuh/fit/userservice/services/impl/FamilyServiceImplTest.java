package edu.vn.iuh.fit.userservice.services.impl;

import edu.vn.iuh.fit.userservice.client.AuthClient;
import edu.vn.iuh.fit.userservice.dto.request.FamilyInviteRequest;
import edu.vn.iuh.fit.userservice.dto.request.FamilyVerifyRequest;
import edu.vn.iuh.fit.userservice.dto.request.SendFamilyInviteEmailRequest;
import edu.vn.iuh.fit.userservice.dto.response.FamilyMemberResponse;
import edu.vn.iuh.fit.userservice.dto.response.FamilyOverviewResponse;
import edu.vn.iuh.fit.userservice.entities.Family;
import edu.vn.iuh.fit.userservice.entities.User;
import edu.vn.iuh.fit.userservice.entities.enums.FamilyStatus;
import edu.vn.iuh.fit.userservice.entities.enums.UserRole;
import edu.vn.iuh.fit.userservice.repositories.FamilyRepository;
import edu.vn.iuh.fit.userservice.repositories.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Family Service Unit Tests")
class FamilyServiceImplTest {

    private static final Long PARENT_ID = 10L;
    private static final Long STUDENT_ID = 20L;
    private static final Long FAMILY_ID = 30L;
    private static final String PARENT_EMAIL = "parent@example.com";
    private static final String STUDENT_EMAIL = "student@example.com";
    private static final String VERIFY_CODE = "123456";

    @Mock
    private FamilyRepository familyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthClient authClient;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private FamilyServiceImpl familyService;

    /**
     * Verifies that a parent invitation is saved as pending and sent by email.
     */
    @Test
    @DisplayName("sendInvite: Tạo lời mời chờ và gửi email cho học sinh")
    void sendInvite_parentInvitesChild_savesFamilyAsPendingAndSendsEmail() {
        // Arrange
        User parent = parent();
        User student = student();
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent));
        when(userRepository.existsByEmail(STUDENT_EMAIL)).thenReturn(true);
        when(userRepository.findUsersByEmail(STUDENT_EMAIL)).thenReturn(student);
        when(familyRepository.findByParentIdAndStudentId(PARENT_ID, STUDENT_ID)).thenReturn(Optional.empty());
        when(familyRepository.save(any(Family.class))).thenAnswer(invocation -> {
            Family family = invocation.getArgument(0);
            family.setId(FAMILY_ID);
            return family;
        });
        ArgumentCaptor<SendFamilyInviteEmailRequest> emailCaptor =
                ArgumentCaptor.forClass(SendFamilyInviteEmailRequest.class);

        // Act
        FamilyMemberResponse response = familyService.sendInvite(
                PARENT_ID, null, FamilyInviteRequest.builder().studentEmail(STUDENT_EMAIL).build());

        // Assert
        assertThat(response.getId()).isEqualTo(FAMILY_ID);
        assertThat(response.getStatus()).isEqualTo(FamilyStatus.PENDING.name());
        verify(familyRepository).save(any(Family.class));
        verify(authClient).sendFamilyInvite(emailCaptor.capture());
        assertThat(emailCaptor.getValue().getRecipient()).isEqualTo(STUDENT_EMAIL);
        assertThat(emailCaptor.getValue().getParentName()).isEqualTo("Parent User");
        assertThat(emailCaptor.getValue().getOtpCode()).matches("\\d{6}");
        verifyNoInteractions(restTemplate);
    }

    /**
     * Verifies that a parent cannot invite their own email.
     */
    @Test
    @DisplayName("sendInvite: Từ chối phụ huynh tự mời chính mình")
    void sendInvite_selfInvite_throwsBadRequest400() {
        // Arrange
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));

        // Act & Assert
        assertBadRequest(
                () -> familyService.sendInvite(PARENT_ID, null,
                        FamilyInviteRequest.builder().studentEmail(" PARENT@example.com ").build()),
                "Không thể liên kết đến chính tài khoản của bạn!");
        verifyNoInteractions(familyRepository, authClient, restTemplate);
    }

    /**
     * Verifies that an empty student email is rejected.
     */
    @Test
    @DisplayName("sendInvite: Từ chối email học sinh rỗng")
    void sendInvite_emptyStudentEmail_throwsBadRequest400() {
        // Arrange
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));

        // Act & Assert
        assertBadRequest(
                () -> familyService.sendInvite(PARENT_ID, null,
                        FamilyInviteRequest.builder().studentEmail("  ").build()),
                "Vui lòng nhập địa chỉ Email của con.");
        verifyNoInteractions(familyRepository, authClient, restTemplate);
    }

    /**
     * Verifies that inviting an unknown student email returns HTTP 404.
     */
    @Test
    @DisplayName("sendInvite: Báo lỗi khi email học sinh không tồn tại")
    void sendInvite_unknownStudentEmail_throwsNotFound404() {
        // Arrange
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));
        when(userRepository.existsByEmail(STUDENT_EMAIL)).thenReturn(false);

        // Act & Assert
        assertNotFound(
                () -> familyService.sendInvite(PARENT_ID, null,
                        FamilyInviteRequest.builder().studentEmail(STUDENT_EMAIL).build()),
                "Không tìm thấy tài khoản học sinh nào với email: " + STUDENT_EMAIL);
        verifyNoInteractions(familyRepository, authClient, restTemplate);
    }

    /**
     * Verifies that an account with the parent role cannot be invited as a child.
     */
    @Test
    @DisplayName("sendInvite: Từ chối liên kết đến tài khoản phụ huynh")
    void sendInvite_targetIsParentRole_throwsBadRequest400() {
        // Arrange
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));
        when(userRepository.existsByEmail(STUDENT_EMAIL)).thenReturn(true);
        when(userRepository.findUsersByEmail(STUDENT_EMAIL))
                .thenReturn(user(STUDENT_ID, STUDENT_EMAIL, "Other Parent", UserRole.ROLE_PARENT));

        // Act & Assert
        assertBadRequest(
                () -> familyService.sendInvite(PARENT_ID, null,
                        FamilyInviteRequest.builder().studentEmail(STUDENT_EMAIL).build()),
                "Email này thuộc tài khoản Phụ huynh, chỉ có thể liên kết với tài khoản Học sinh!");
        verifyNoInteractions(authClient, restTemplate);
    }

    /**
     * Verifies that an already linked parent/student pair cannot be invited again.
     */
    @Test
    @DisplayName("sendInvite: Từ chối mời học sinh đã liên kết")
    void sendInvite_alreadyLinked_throwsBadRequest400() {
        // Arrange
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));
        when(userRepository.existsByEmail(STUDENT_EMAIL)).thenReturn(true);
        when(userRepository.findUsersByEmail(STUDENT_EMAIL)).thenReturn(student());
        when(familyRepository.findByParentIdAndStudentId(PARENT_ID, STUDENT_ID))
                .thenReturn(Optional.of(family(FamilyStatus.LINKED)));

        // Act & Assert
        assertBadRequest(
                () -> familyService.sendInvite(PARENT_ID, null,
                        FamilyInviteRequest.builder().studentEmail(STUDENT_EMAIL).build()),
                "Tài khoản học sinh này đã được liên kết với bạn rồi!");
        verify(familyRepository, never()).save(any(Family.class));
        verifyNoInteractions(authClient, restTemplate);
    }

    /**
     * Verifies that a previous pending invitation is updated rather than replaced.
     */
    @Test
    @DisplayName("sendInvite: Cập nhật bản ghi lời mời đang chờ")
    void sendInvite_existingPendingRecord_updatesExistingFamilyRecord() {
        // Arrange
        Family existing = family(FamilyStatus.PENDING);
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));
        when(userRepository.existsByEmail(STUDENT_EMAIL)).thenReturn(true);
        when(userRepository.findUsersByEmail(STUDENT_EMAIL)).thenReturn(student());
        when(familyRepository.findByParentIdAndStudentId(PARENT_ID, STUDENT_ID))
                .thenReturn(Optional.of(existing));
        when(familyRepository.save(existing)).thenReturn(existing);

        // Act
        FamilyMemberResponse response = familyService.sendInvite(
                PARENT_ID, null, FamilyInviteRequest.builder().studentEmail(STUDENT_EMAIL).build());

        // Assert
        assertThat(response.getId()).isEqualTo(FAMILY_ID);
        assertThat(existing.getStatus()).isEqualTo(FamilyStatus.PENDING);
        assertThat(existing.getVerificationCode()).matches("\\d{6}");
        assertThat(existing.getExpiresAt()).isAfter(LocalDateTime.now());
        verify(familyRepository).save(existing);
        verify(authClient).sendFamilyInvite(any(SendFamilyInviteEmailRequest.class));
    }

    /**
     * Verifies that a correct verification code links the invitation and clears the code.
     */
    @Test
    @DisplayName("verifyInvite: Mã xác thực đúng chuyển lời mời sang trạng thái đã liên kết")
    void verifyInvite_correctCode_setsStatusLinked() {
        // Arrange
        Family invitation = family(FamilyStatus.PENDING);
        invitation.setExpiresAt(LocalDateTime.now().plusHours(1));
        when(userRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student()));
        when(familyRepository.findByStudentIdAndVerificationCodeAndStatus(
                STUDENT_ID, VERIFY_CODE, FamilyStatus.PENDING)).thenReturn(Optional.of(invitation));
        when(familyRepository.save(invitation)).thenReturn(invitation);
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));

        // Act
        FamilyMemberResponse response = familyService.verifyInvite(
                STUDENT_ID, null, FamilyVerifyRequest.builder().verificationCode(VERIFY_CODE).build());

        // Assert
        assertThat(response.getStatus()).isEqualTo(FamilyStatus.LINKED.name());
        assertThat(invitation.getStatus()).isEqualTo(FamilyStatus.LINKED);
        assertThat(invitation.getVerificationCode()).isNull();
        verify(familyRepository).save(invitation);
    }

    /**
     * Verifies that accepting an invitation sets the student's parentId.
     */
    @Test
    @DisplayName("verifyInvite: Cập nhật parentId của học sinh khi xác nhận lời mời")
    void verifyInvite_correctCode_updatesStudentParentId() {
        // Arrange
        User student = student();
        Family invitation = family(FamilyStatus.PENDING);
        invitation.setExpiresAt(LocalDateTime.now().plusHours(1));
        when(userRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student));
        when(familyRepository.findByStudentIdAndVerificationCodeAndStatus(
                STUDENT_ID, VERIFY_CODE, FamilyStatus.PENDING)).thenReturn(Optional.of(invitation));
        when(familyRepository.save(invitation)).thenReturn(invitation);
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));

        // Act
        familyService.verifyInvite(
                STUDENT_ID, null, FamilyVerifyRequest.builder().verificationCode(VERIFY_CODE).build());

        // Assert
        assertThat(student.getParentId()).isEqualTo(PARENT_ID);
        verify(userRepository).save(student);
    }

    /**
     * Verifies that an incorrect verification code returns HTTP 400.
     */
    @Test
    @DisplayName("verifyInvite: Từ chối mã xác thực không chính xác")
    void verifyInvite_wrongCode_throwsBadRequest400() {
        // Arrange
        when(userRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student()));
        when(familyRepository.findByStudentIdAndVerificationCodeAndStatus(
                STUDENT_ID, "wrong", FamilyStatus.PENDING)).thenReturn(Optional.empty());

        // Act & Assert
        assertBadRequest(
                () -> familyService.verifyInvite(STUDENT_ID, null,
                        FamilyVerifyRequest.builder().verificationCode("wrong").build()),
                "Mã xác nhận không chính xác hoặc lời mời không tồn tại!");
        verify(familyRepository, never()).save(any(Family.class));
    }

    /**
     * Verifies that an expired invitation code returns HTTP 400.
     */
    @Test
    @DisplayName("verifyInvite: Từ chối mã xác thực đã hết hạn")
    void verifyInvite_expiredCode_throwsBadRequest400() {
        // Arrange
        Family expired = family(FamilyStatus.PENDING);
        expired.setExpiresAt(LocalDateTime.now().minusSeconds(1));
        when(userRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student()));
        when(familyRepository.findByStudentIdAndVerificationCodeAndStatus(
                STUDENT_ID, VERIFY_CODE, FamilyStatus.PENDING)).thenReturn(Optional.of(expired));

        // Act & Assert
        assertBadRequest(
                () -> familyService.verifyInvite(STUDENT_ID, null,
                        FamilyVerifyRequest.builder().verificationCode(VERIFY_CODE).build()),
                "Mã xác nhận đã hết hạn (quá 24 giờ). Vui lòng yêu cầu phụ huynh gửi lại lời mời.");
        verify(familyRepository, never()).save(any(Family.class));
        verify(userRepository, never()).save(any(User.class));
    }

    /**
     * Verifies that accepting an invitation does not overwrite an existing parentId.
     */
    @Test
    @DisplayName("verifyInvite: Không ghi đè parentId học sinh đã có")
    void verifyInvite_studentAlreadyHasParentId_doesNotOverwrite() {
        // Arrange
        User student = student();
        student.setParentId(99L);
        Family invitation = family(FamilyStatus.PENDING);
        invitation.setExpiresAt(LocalDateTime.now().plusHours(1));
        when(userRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student));
        when(familyRepository.findByStudentIdAndVerificationCodeAndStatus(
                STUDENT_ID, VERIFY_CODE, FamilyStatus.PENDING)).thenReturn(Optional.of(invitation));
        when(familyRepository.save(invitation)).thenReturn(invitation);
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));

        // Act
        familyService.verifyInvite(
                STUDENT_ID, null, FamilyVerifyRequest.builder().verificationCode(VERIFY_CODE).build());

        // Assert
        assertThat(student.getParentId()).isEqualTo(99L);
        verify(userRepository, never()).save(student);
    }

    /**
     * Verifies that a student can reject their own invitation.
     */
    @Test
    @DisplayName("rejectInvite: Học sinh từ chối lời mời của mình")
    void rejectInvite_studentOwnsInvite_setsStatusRejected() {
        // Arrange
        Family invitation = family(FamilyStatus.PENDING);
        when(userRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student()));
        when(familyRepository.findById(FAMILY_ID)).thenReturn(Optional.of(invitation));

        // Act
        familyService.rejectInvite(STUDENT_ID, null, FAMILY_ID);

        // Assert
        assertThat(invitation.getStatus()).isEqualTo(FamilyStatus.REJECTED);
        assertThat(invitation.getVerificationCode()).isNull();
        verify(familyRepository).save(invitation);
    }

    /**
     * Verifies that rejecting a nonexistent invitation returns HTTP 404.
     */
    @Test
    @DisplayName("rejectInvite: Báo lỗi khi không tìm thấy lời mời")
    void rejectInvite_inviteNotFound_throwsNotFound404() {
        // Arrange
        when(userRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student()));
        when(familyRepository.findById(FAMILY_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertNotFound(
                () -> familyService.rejectInvite(STUDENT_ID, null, FAMILY_ID),
                "Không tìm thấy lời mời liên kết.");
        verify(familyRepository, never()).save(any(Family.class));
    }

    /**
     * Verifies that another student cannot reject an invitation they do not own.
     */
    @Test
    @DisplayName("rejectInvite: Từ chối thao tác của học sinh không sở hữu lời mời")
    void rejectInvite_otherStudentTries_throwsForbidden403() {
        // Arrange
        Family invitation = family(FamilyStatus.PENDING);
        when(userRepository.findById(99L))
                .thenReturn(Optional.of(user(99L, "other@example.com", "Other", UserRole.ROLE_CHILDREN)));
        when(familyRepository.findById(FAMILY_ID)).thenReturn(Optional.of(invitation));

        // Act & Assert
        assertForbidden(
                () -> familyService.rejectInvite(99L, null, FAMILY_ID),
                "Bạn không có quyền từ chối lời mời này.");
        verify(familyRepository, never()).save(any(Family.class));
    }

    /**
     * Verifies that a parent can cancel a family invitation by deleting its record.
     */
    @Test
    @DisplayName("cancelOrRemoveLink: Phụ huynh hủy liên kết và xóa bản ghi")
    void cancelOrRemoveLink_parentCancels_deletesFamilyRecord() {
        // Arrange
        Family family = family(FamilyStatus.PENDING);
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));
        when(familyRepository.findById(FAMILY_ID)).thenReturn(Optional.of(family));

        // Act
        familyService.cancelOrRemoveLink(PARENT_ID, null, FAMILY_ID);

        // Assert
        verify(familyRepository).delete(family);
        verify(userRepository, never()).save(any(User.class));
    }

    /**
     * Verifies that a student can remove their family link by deleting its record.
     */
    @Test
    @DisplayName("cancelOrRemoveLink: Học sinh gỡ liên kết và xóa bản ghi")
    void cancelOrRemoveLink_studentRemoves_deletesFamilyRecord() {
        // Arrange
        Family family = family(FamilyStatus.PENDING);
        when(userRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student()));
        when(familyRepository.findById(FAMILY_ID)).thenReturn(Optional.of(family));

        // Act
        familyService.cancelOrRemoveLink(STUDENT_ID, null, FAMILY_ID);

        // Assert
        verify(familyRepository).delete(family);
        verify(userRepository, never()).save(any(User.class));
    }

    /**
     * Verifies that an unrelated user cannot remove a family link.
     */
    @Test
    @DisplayName("cancelOrRemoveLink: Từ chối người không thuộc liên kết")
    void cancelOrRemoveLink_unrelatedUser_throwsForbidden403() {
        // Arrange
        Family family = family(FamilyStatus.LINKED);
        when(userRepository.findById(99L))
                .thenReturn(Optional.of(user(99L, "other@example.com", "Other", UserRole.ROLE_PARENT)));
        when(familyRepository.findById(FAMILY_ID)).thenReturn(Optional.of(family));

        // Act & Assert
        assertForbidden(
                () -> familyService.cancelOrRemoveLink(99L, null, FAMILY_ID),
                "Bạn không có quyền thực hiện thao tác này.");
        verify(familyRepository, never()).delete(any(Family.class));
    }

    /**
     * Verifies that deleting a linked relationship clears the student's matching parentId.
     */
    @Test
    @DisplayName("cancelOrRemoveLink: Xóa parentId của học sinh khi gỡ liên kết đã xác nhận")
    void cancelOrRemoveLink_linkedStatus_clearsStudentParentId() {
        // Arrange
        Family family = family(FamilyStatus.LINKED);
        User student = student();
        student.setParentId(PARENT_ID);
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));
        when(familyRepository.findById(FAMILY_ID)).thenReturn(Optional.of(family));
        when(userRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student));

        // Act
        familyService.cancelOrRemoveLink(PARENT_ID, null, FAMILY_ID);

        // Assert
        assertThat(student.getParentId()).isNull();
        verify(familyRepository).delete(family);
        verify(userRepository).save(student);
    }

    /**
     * Verifies that deleting a pending invitation does not change the student's parentId.
     */
    @Test
    @DisplayName("cancelOrRemoveLink: Không đổi parentId khi xóa lời mời đang chờ")
    void cancelOrRemoveLink_pendingStatus_doesNotClearStudentParentId() {
        // Arrange
        Family family = family(FamilyStatus.PENDING);
        User student = student();
        student.setParentId(99L);
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));
        when(familyRepository.findById(FAMILY_ID)).thenReturn(Optional.of(family));

        // Act
        familyService.cancelOrRemoveLink(PARENT_ID, null, FAMILY_ID);

        // Assert
        assertThat(student.getParentId()).isEqualTo(99L);
        verify(familyRepository).delete(family);
        verify(userRepository, never()).findById(STUDENT_ID);
        verify(userRepository, never()).save(any(User.class));
    }

    /**
     * Verifies that removing a nonexistent family relationship returns HTTP 404.
     */
    @Test
    @DisplayName("cancelOrRemoveLink: Báo lỗi khi không tìm thấy liên kết")
    void cancelOrRemoveLink_familyNotFound_throwsNotFound404() {
        // Arrange
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent()));
        when(familyRepository.findById(FAMILY_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertNotFound(
                () -> familyService.cancelOrRemoveLink(PARENT_ID, null, FAMILY_ID),
                "Không tìm thấy liên kết gia đình.");
        verify(familyRepository, never()).delete(any(Family.class));
    }

    /**
     * Verifies that a parent's overview separates linked members and pending invitations.
     */
    @Test
    @DisplayName("getFamilyOverview: Phụ huynh xem danh sách liên kết và lời mời đang chờ")
    void getFamilyOverview_parentRole_returnsLinkedAndPendingForParent() {
        // Arrange
        User parent = parent();
        Family linked = family(FamilyStatus.LINKED);
        Family pending = Family.builder()
                .id(31L)
                .parentId(PARENT_ID)
                .studentId(21L)
                .status(FamilyStatus.PENDING)
                .build();
        User linkedStudent = student();
        User pendingStudent = user(21L, "pending@example.com", "Pending Student", UserRole.ROLE_CHILDREN);
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(parent));
        when(familyRepository.findByParentIdAndStatus(PARENT_ID, FamilyStatus.LINKED)).thenReturn(List.of(linked));
        when(familyRepository.findByParentIdAndStatus(PARENT_ID, FamilyStatus.PENDING)).thenReturn(List.of(pending));
        when(userRepository.findById(STUDENT_ID)).thenReturn(Optional.of(linkedStudent));
        when(userRepository.findById(21L)).thenReturn(Optional.of(pendingStudent));

        // Act
        FamilyOverviewResponse response = familyService.getFamilyOverview(PARENT_ID, null);

        // Assert
        assertThat(response.getLinkedMembers()).hasSize(1);
        assertThat(response.getLinkedMembers().getFirst().getStudentName()).isEqualTo("Student User");
        assertThat(response.getPendingInvites()).hasSize(1);
        assertThat(response.getPendingInvites().getFirst().getStudentName()).isEqualTo("Pending Student");
    }

    /**
     * Verifies that a student's overview separates linked parents and pending invitations.
     */
    @Test
    @DisplayName("getFamilyOverview: Học sinh xem danh sách liên kết và lời mời đang chờ")
    void getFamilyOverview_studentRole_returnsLinkedAndPendingForStudent() {
        // Arrange
        User student = student();
        Family linked = family(FamilyStatus.LINKED);
        Family pending = Family.builder()
                .id(31L)
                .parentId(11L)
                .studentId(STUDENT_ID)
                .status(FamilyStatus.PENDING)
                .build();
        User linkedParent = parent();
        User pendingParent = user(11L, "pending-parent@example.com", "Pending Parent", UserRole.ROLE_PARENT);
        when(userRepository.findById(STUDENT_ID)).thenReturn(Optional.of(student));
        when(familyRepository.findByStudentIdAndStatus(STUDENT_ID, FamilyStatus.LINKED)).thenReturn(List.of(linked));
        when(familyRepository.findByStudentIdAndStatus(STUDENT_ID, FamilyStatus.PENDING)).thenReturn(List.of(pending));
        when(userRepository.findById(PARENT_ID)).thenReturn(Optional.of(linkedParent));
        when(userRepository.findById(11L)).thenReturn(Optional.of(pendingParent));

        // Act
        FamilyOverviewResponse response = familyService.getFamilyOverview(STUDENT_ID, null);

        // Assert
        assertThat(response.getLinkedMembers()).hasSize(1);
        assertThat(response.getLinkedMembers().getFirst().getParentName()).isEqualTo("Parent User");
        assertThat(response.getPendingInvites()).hasSize(1);
        assertThat(response.getPendingInvites().getFirst().getParentName()).isEqualTo("Pending Parent");
    }

    private User parent() {
        return user(PARENT_ID, PARENT_EMAIL, "Parent User", UserRole.ROLE_PARENT);
    }

    private User student() {
        return user(STUDENT_ID, STUDENT_EMAIL, "Student User", UserRole.ROLE_CHILDREN);
    }

    private User user(Long id, String email, String username, UserRole role) {
        return User.builder()
                .id(id)
                .email(email)
                .username(username)
                .role(role)
                .build();
    }

    private Family family(FamilyStatus status) {
        return Family.builder()
                .id(FAMILY_ID)
                .parentId(PARENT_ID)
                .studentId(STUDENT_ID)
                .status(status)
                .verificationCode(VERIFY_CODE)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();
    }

    private void assertBadRequest(Runnable action, String reason) {
        assertThatThrownBy(action::run)
                .isInstanceOfSatisfying(ResponseStatusException.class, exception -> {
                    assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(exception.getReason()).isEqualTo(reason);
                    assertThat(exception.getMessage()).contains(reason);
                });
    }

    private void assertNotFound(Runnable action, String reason) {
        assertThatThrownBy(action::run)
                .isInstanceOfSatisfying(ResponseStatusException.class, exception -> {
                    assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                    assertThat(exception.getReason()).isEqualTo(reason);
                    assertThat(exception.getMessage()).contains(reason);
                });
    }

    private void assertForbidden(Runnable action, String reason) {
        assertThatThrownBy(action::run)
                .isInstanceOfSatisfying(ResponseStatusException.class, exception -> {
                    assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(exception.getReason()).isEqualTo(reason);
                    assertThat(exception.getMessage()).contains(reason);
                });
    }
}
