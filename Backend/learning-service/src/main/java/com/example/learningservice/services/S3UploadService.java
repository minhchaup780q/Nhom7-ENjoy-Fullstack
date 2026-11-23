package com.example.learningservice.services;

import org.springframework.web.multipart.MultipartFile;

public interface S3UploadService {

    /**
     * Đẩy 1 file lên S3 và trả về URL công khai.
     *
     * @param file         file nhận từ form multipart
     * @param folderPrefix thư mục trên bucket, ví dụ "exam-images"
     */
    String uploadFile(MultipartFile file, String folderPrefix);
}
