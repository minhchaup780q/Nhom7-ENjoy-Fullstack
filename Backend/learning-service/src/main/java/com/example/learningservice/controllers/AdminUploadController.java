package com.example.learningservice.controllers;

import com.example.learningservice.services.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Nhận file ảnh/audio từ trang Admin, đẩy lên S3 và trả về URL để lưu vào payload.
 * FE gọi thẳng learning-service qua Gateway (không đi qua Feign của admin-service,
 * vì truyền MultipartFile qua Feign cần thêm thư viện và rất dễ lỗi).
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/uploads")
@RequiredArgsConstructor
public class AdminUploadController {

    private final S3UploadService s3UploadService;

    private static final List<String> IMAGE_TYPES = List.of("image/jpeg", "image/png", "image/webp", "image/jpg");
    private static final List<String> AUDIO_TYPES = List.of("audio/mpeg", "audio/mp3", "audio/wav",
            "audio/x-wav", "audio/mp4", "audio/x-m4a", "audio/m4a");

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        requireContentType(file, IMAGE_TYPES, "ảnh (JPG, PNG, WEBP)");
        return ResponseEntity.ok(Map.of("url", s3UploadService.uploadFile(file, "exam-images")));
    }

    @PostMapping("/audio")
    public ResponseEntity<Map<String, String>> uploadAudio(@RequestParam("file") MultipartFile file) {
        requireContentType(file, AUDIO_TYPES, "âm thanh (MP3, WAV, M4A)");
        return ResponseEntity.ok(Map.of("url", s3UploadService.uploadFile(file, "exam-audio")));
    }

    private void requireContentType(MultipartFile file, List<String> allowed, String label) {
        String type = file.getContentType();
        if (type == null || !allowed.contains(type.toLowerCase())) {
            throw new IllegalArgumentException("Chỉ chấp nhận file " + label + ". Định dạng nhận được: " + type);
        }
    }
}
