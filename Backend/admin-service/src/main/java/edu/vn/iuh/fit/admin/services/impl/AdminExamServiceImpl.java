package edu.vn.iuh.fit.admin.services.impl;

import edu.vn.iuh.fit.admin.client.ExamClient;
import edu.vn.iuh.fit.admin.dto.request.AdminExamRequest;
import edu.vn.iuh.fit.admin.dto.response.AdminExamDetailResponse;
import edu.vn.iuh.fit.admin.dto.response.AdminExamResponse;
import edu.vn.iuh.fit.admin.dto.response.PublishValidationResult;
import edu.vn.iuh.fit.admin.services.AdminExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminExamServiceImpl implements AdminExamService {

    private final ExamClient examClient;

    // Chỉ các thao tác ĐỌC mới có fallback im lặng. Thao tác GHI phải ném lỗi ra ngoài
    // để admin biết nội dung vừa soạn chưa lưu được, tránh mất bài.

    @Override
    public List<AdminExamResponse> getAllExams() {
        try {
            return examClient.getAllExams();
        } catch (Exception e) {
            System.err.println("⚠️ Error calling learning-service via OpenFeign for exam list: " + e.getMessage());
            return List.of();
        }
    }

    @Override
    public AdminExamDetailResponse getExamDetail(Long id) {
        return examClient.getExamDetail(id);
    }

    @Override
    public AdminExamResponse createExam(AdminExamRequest request) {
        return examClient.createExam(request);
    }

    @Override
    public AdminExamResponse updateExamMetadata(Long id, AdminExamRequest request) {
        return examClient.updateExamMetadata(id, request);
    }

    @Override
    public AdminExamDetailResponse saveListeningPart(Long id, String partKey, Object partData) {
        return examClient.saveListeningPart(id, partKey, partData);
    }

    @Override
    public AdminExamDetailResponse saveReadingPart(Long id, String partKey, Object partData) {
        return examClient.saveReadingPart(id, partKey, partData);
    }

    @Override
    public PublishValidationResult publishExam(Long id) {
        return examClient.publishExam(id);
    }
}
