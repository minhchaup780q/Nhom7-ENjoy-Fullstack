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
import edu.vn.iuh.fit.userservice.services.FamilyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FamilyServiceImpl implements FamilyService {

    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final AuthClient authClient;
    private final org.springframework.web.client.RestTemplate restTemplate;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public FamilyMemberResponse sendInvite(Long parentUserId, String parentEmail, FamilyInviteRequest request) {
        User parent = findUser(parentUserId, parentEmail);

        if (request.getStudentEmail() == null || request.getStudentEmail().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng nhập địa chỉ Email của con.");
        }

        String targetEmail = request.getStudentEmail().trim();
        if (targetEmail.equalsIgnoreCase(parent.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể liên kết đến chính tài khoản của bạn!");
        }

        if (!userRepository.existsByEmail(targetEmail)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản học sinh nào với email: " + targetEmail);
        }

        User student = userRepository.findUsersByEmail(targetEmail);
        if (student.getRole() == UserRole.ROLE_PARENT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email này thuộc tài khoản Phụ huynh, chỉ có thể liên kết với tài khoản Học sinh!");
        }

        Optional<Family> existingOpt = familyRepository.findByParentIdAndStudentId(parent.getId(), student.getId());
        if (existingOpt.isPresent() && existingOpt.get().getStatus() == FamilyStatus.LINKED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tài khoản học sinh này đã được liên kết với bạn rồi!");
        }

        String otpCode = String.format("%06d", secureRandom.nextInt(1000000));
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusHours(24);

        Family family = existingOpt.orElse(Family.builder()
                .parentId(parent.getId())
                .studentId(student.getId())
                .createdAt(now)
                .build());

        family.setStatus(FamilyStatus.PENDING);
        family.setVerificationCode(otpCode);
        family.setExpiresAt(expiresAt);
        family.setUpdatedAt(now);
        family = familyRepository.save(family);

        // Gửi email chứa mã OTP qua auth-service
        String parentDisplayName = parent.getUsername() != null && !parent.getUsername().trim().isEmpty() 
                ? parent.getUsername() 
                : parent.getEmail();

        SendFamilyInviteEmailRequest emailReq = SendFamilyInviteEmailRequest.builder()
                .recipient(student.getEmail())
                .parentName(parentDisplayName)
                .otpCode(otpCode)
                .build();

        boolean sent = false;
        try {
            authClient.sendFamilyInvite(emailReq);
            System.out.println("✅ [user-service] Đã gọi auth-service qua FeignClient gửi email OTP thành công đến " + student.getEmail());
            sent = true;
        } catch (Exception e) {
            System.err.println("⚠️ [user-service] FeignClient thất bại (" + e.getMessage() + "), đang thử fallback qua RestTemplate trực tiếp...");
        }

        if (!sent) {
            try {
                restTemplate.postForEntity("http://localhost:8084/api/auth/internal/send-family-invite", emailReq, Void.class);
                System.out.println("✅ [user-service] Đã gọi auth-service qua RestTemplate thành công gửi email đến " + student.getEmail());
            } catch (Exception ex) {
                System.err.println("❌ [user-service] Không thể gửi yêu cầu email sang auth-service: " + ex.getMessage());
                ex.printStackTrace();
            }
        }

        return mapToMemberResponse(family, parent, student);
    }

    @Override
    @Transactional
    public FamilyMemberResponse verifyInvite(Long studentUserId, String studentEmail, FamilyVerifyRequest request) {
        User student = findUser(studentUserId, studentEmail);

        if (request.getVerificationCode() == null || request.getVerificationCode().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng nhập mã xác thực.");
        }

        String code = request.getVerificationCode().trim();
        Family family = familyRepository.findByStudentIdAndVerificationCodeAndStatus(student.getId(), code, FamilyStatus.PENDING)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã xác nhận không chính xác hoặc lời mời không tồn tại!"));

        if (family.getExpiresAt() != null && family.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã xác nhận đã hết hạn (quá 24 giờ). Vui lòng yêu cầu phụ huynh gửi lại lời mời.");
        }

        LocalDateTime now = LocalDateTime.now();
        family.setStatus(FamilyStatus.LINKED);
        family.setVerificationCode(null);
        family.setUpdatedAt(now);
        family = familyRepository.save(family);

        // Cập nhật parentId vào User profile của học sinh nếu chưa có
        if (student.getParentId() == null) {
            student.setParentId(family.getParentId());
            userRepository.save(student);
        }

        User parent = userRepository.findById(family.getParentId()).orElse(null);
        return mapToMemberResponse(family, parent, student);
    }

    @Override
    @Transactional
    public void rejectInvite(Long studentUserId, String studentEmail, Long familyId) {
        User student = findUser(studentUserId, studentEmail);
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lời mời liên kết."));

        if (!family.getStudentId().equals(student.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền từ chối lời mời này.");
        }

        family.setStatus(FamilyStatus.REJECTED);
        family.setVerificationCode(null);
        family.setUpdatedAt(LocalDateTime.now());
        familyRepository.save(family);
    }

    @Override
    @Transactional
    public void cancelOrRemoveLink(Long userId, String email, Long familyId) {
        User user = findUser(userId, email);
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy liên kết gia đình."));

        if (!family.getParentId().equals(user.getId()) && !family.getStudentId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này.");
        }

        familyRepository.delete(family);

        // Nếu xóa liên kết đã LINKED, bỏ parentId ở student
        if (family.getStatus() == FamilyStatus.LINKED) {
            userRepository.findById(family.getStudentId()).ifPresent(student -> {
                if (student.getParentId() != null && student.getParentId().equals(family.getParentId())) {
                    student.setParentId(null);
                    userRepository.save(student);
                }
            });
        }
    }

    @Override
    @Transactional(readOnly = true)
    public FamilyOverviewResponse getFamilyOverview(Long userId, String email) {
        User currentUser = findUser(userId, email);
        List<FamilyMemberResponse> linkedList = new ArrayList<>();
        List<FamilyMemberResponse> pendingList = new ArrayList<>();

        if (currentUser.getRole() == UserRole.ROLE_PARENT) {
            List<Family> linkedFamilies = familyRepository.findByParentIdAndStatus(currentUser.getId(), FamilyStatus.LINKED);
            for (Family f : linkedFamilies) {
                User student = userRepository.findById(f.getStudentId()).orElse(null);
                linkedList.add(mapToMemberResponse(f, currentUser, student));
            }

            List<Family> pendingFamilies = familyRepository.findByParentIdAndStatus(currentUser.getId(), FamilyStatus.PENDING);
            for (Family f : pendingFamilies) {
                User student = userRepository.findById(f.getStudentId()).orElse(null);
                pendingList.add(mapToMemberResponse(f, currentUser, student));
            }
        } else {
            List<Family> linkedFamilies = familyRepository.findByStudentIdAndStatus(currentUser.getId(), FamilyStatus.LINKED);
            for (Family f : linkedFamilies) {
                User parent = userRepository.findById(f.getParentId()).orElse(null);
                linkedList.add(mapToMemberResponse(f, parent, currentUser));
            }

            List<Family> pendingFamilies = familyRepository.findByStudentIdAndStatus(currentUser.getId(), FamilyStatus.PENDING);
            for (Family f : pendingFamilies) {
                User parent = userRepository.findById(f.getParentId()).orElse(null);
                pendingList.add(mapToMemberResponse(f, parent, currentUser));
            }
        }

        return FamilyOverviewResponse.builder()
                .linkedMembers(linkedList)
                .pendingInvites(pendingList)
                .build();
    }

    private FamilyMemberResponse mapToMemberResponse(Family family, User parent, User student) {
        return FamilyMemberResponse.builder()
                .id(family.getId())
                .parentId(family.getParentId())
                .parentName(parent != null ? parent.getUsername() : "Phụ huynh")
                .parentEmail(parent != null ? parent.getEmail() : null)
                .parentAvatarUrl(parent != null ? parent.getAvatarUrl() : null)
                .studentId(family.getStudentId())
                .studentName(student != null ? student.getUsername() : "Học sinh")
                .studentEmail(student != null ? student.getEmail() : null)
                .studentAvatarUrl(student != null ? student.getAvatarUrl() : null)
                .status(family.getStatus() != null ? family.getStatus().name() : null)
                .expiresAt(family.getExpiresAt())
                .createdAt(family.getCreatedAt())
                .build();
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
