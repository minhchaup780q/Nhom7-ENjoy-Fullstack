package com.example.learningservice.services;

import com.example.learningservice.dto.admin.AdminExamDetailResponse;
import com.example.learningservice.dto.admin.AdminExamRequest;
import com.example.learningservice.dto.admin.AdminExamResponse;
import com.example.learningservice.dto.admin.PublishValidationResult;

import java.util.List;

public interface AdminExamService {

    /** Danh sách tất cả đề thi cho trang quản trị, kèm số lượt làm. */
    List<AdminExamResponse> getAllExamsForAdmin();

    /** Chi tiết 1 đề thi kèm payload thô (để soạn thảo / xem trước). */
    AdminExamDetailResponse getExamDetail(Long id);

    /** Tạo vỏ đề thi: chỉ thông tin cơ bản, payload rỗng, ở trạng thái nháp. */
    AdminExamResponse createExam(AdminExamRequest request);

    /** Cập nhật thông tin cơ bản của đề thi. */
    AdminExamResponse updateExamMetadata(Long id, AdminExamRequest request);

    /** Lưu/ghi đè 1 phần của bài Nghe (partKey: part1..part4). */
    AdminExamDetailResponse saveListeningPart(Long id, String partKey, Object partData);

    /** Lưu/ghi đè 1 phần của bài Đọc (partKey: part1..part5). */
    AdminExamDetailResponse saveReadingPart(Long id, String partKey, Object partData);

    /** Xuất bản đề thi; chỉ thành công khi đã soạn đủ 9 phần. */
    PublishValidationResult publishExam(Long id);
}
