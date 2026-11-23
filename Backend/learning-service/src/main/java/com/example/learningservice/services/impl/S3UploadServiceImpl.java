package com.example.learningservice.services.impl;

import com.example.learningservice.services.S3UploadService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
public class S3UploadServiceImpl implements S3UploadService {

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.access-key-id:}")
    private String accessKeyId;

    @Value("${aws.s3.secret-access-key:}")
    private String secretAccessKey;

    private S3Client s3Client;

    @PostConstruct
    void init() {
        var builder = S3Client.builder().region(Region.of(region));
        if (!accessKeyId.isBlank() && !secretAccessKey.isBlank()) {
            builder.credentialsProvider(StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(accessKeyId, secretAccessKey)));
        } else {
            // Không cấu hình key trong properties -> dùng chuỗi credential mặc định
            // (biến môi trường, ~/.aws/credentials, IAM role...)
            builder.credentialsProvider(DefaultCredentialsProvider.create());
        }
        this.s3Client = builder.build();
        log.info("Đã khởi tạo S3Client cho bucket {} tại region {}", bucketName, region);
    }

    @PreDestroy
    void shutdown() {
        if (s3Client != null) s3Client.close();
    }

    @Override
    public String uploadFile(MultipartFile file, String folderPrefix) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File tải lên đang trống");
        }

        String key = folderPrefix + "/" + UUID.randomUUID() + extensionOf(file.getOriginalFilename());

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(file.getBytes()));
        } catch (IOException e) {
            log.error("Không đọc được nội dung file tải lên", e);
            throw new RuntimeException("Không đọc được nội dung file tải lên");
        }

        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
    }

    private String extensionOf(String originalFilename) {
        if (originalFilename == null) return "";
        int dot = originalFilename.lastIndexOf('.');
        return dot >= 0 ? originalFilename.substring(dot).toLowerCase() : "";
    }
}
