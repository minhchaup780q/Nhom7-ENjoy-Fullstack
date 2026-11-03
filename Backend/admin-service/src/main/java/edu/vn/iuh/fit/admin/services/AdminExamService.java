package edu.vn.iuh.fit.admin.services;

import edu.vn.iuh.fit.admin.dto.request.AdminExamRequest;
import edu.vn.iuh.fit.admin.dto.response.AdminExamDetailResponse;
import edu.vn.iuh.fit.admin.dto.response.AdminExamResponse;
import edu.vn.iuh.fit.admin.dto.response.PublishValidationResult;

import java.util.List;

public interface AdminExamService {

    List<AdminExamResponse> getAllExams();

    AdminExamDetailResponse getExamDetail(Long id);

    AdminExamResponse createExam(AdminExamRequest request);

    AdminExamResponse updateExamMetadata(Long id, AdminExamRequest request);

    AdminExamDetailResponse saveListeningPart(Long id, String partKey, Object partData);

    AdminExamDetailResponse saveReadingPart(Long id, String partKey, Object partData);

    PublishValidationResult publishExam(Long id);
}
