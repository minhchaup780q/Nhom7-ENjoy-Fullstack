package edu.vn.iuh.fit.admin.client;

import edu.vn.iuh.fit.admin.dto.request.AdminExamRequest;
import edu.vn.iuh.fit.admin.dto.response.AdminExamDetailResponse;
import edu.vn.iuh.fit.admin.dto.response.AdminExamResponse;
import edu.vn.iuh.fit.admin.dto.response.PublishValidationResult;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Gọi sang learning-service — nơi đặt toàn bộ nghiệp vụ soạn thảo đề thi
// (đúng domain: đề thi, câu hỏi, chấm điểm đều thuộc learning-service).
@FeignClient(name = "learning-service")
public interface ExamClient {

    @GetMapping("/api/exams/internal")
    List<AdminExamResponse> getAllExams();

    @GetMapping("/api/exams/internal/{id}")
    AdminExamDetailResponse getExamDetail(@PathVariable("id") Long id);

    @PostMapping("/api/exams/internal")
    AdminExamResponse createExam(@RequestBody AdminExamRequest request);

    @PutMapping("/api/exams/internal/{id}/metadata")
    AdminExamResponse updateExamMetadata(@PathVariable("id") Long id, @RequestBody AdminExamRequest request);

    @PutMapping("/api/exams/internal/{id}/listening/{partKey}")
    AdminExamDetailResponse saveListeningPart(@PathVariable("id") Long id,
                                              @PathVariable("partKey") String partKey,
                                              @RequestBody Object partData);

    @PutMapping("/api/exams/internal/{id}/reading/{partKey}")
    AdminExamDetailResponse saveReadingPart(@PathVariable("id") Long id,
                                            @PathVariable("partKey") String partKey,
                                            @RequestBody Object partData);

    @PostMapping("/api/exams/internal/{id}/publish")
    PublishValidationResult publishExam(@PathVariable("id") Long id);
}
