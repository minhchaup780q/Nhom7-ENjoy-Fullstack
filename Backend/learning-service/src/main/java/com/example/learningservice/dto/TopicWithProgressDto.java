package com.example.learningservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO trả về thông tin topic kèm grammar name và trạng thái học của user.
 * Dùng để render danh sách topics trên trang Learn với thông tin được cá nhân hóa.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicWithProgressDto {

    private Long id;
    private Long levelId;           // Thêm để khớp với Topic interface ở frontend
    private String title;
    private String description;
    private String thumbnailUrl;
    private Integer orderIndex;

    /**
     * Tên grammar sẽ học trong topic này (lấy từ payload.title của session GRAMMAR).
     * Null nếu topic không có session Grammar.
     */
    private String grammarName;

    /**
     * Trạng thái học của user với topic này:
     * - "FULL"    : Cần học cả từ vựng (1-5) lẫn ngữ pháp (6-10)
     * - "GRAMMAR_ONLY" : Đã pass từ vựng, chỉ còn học ngữ pháp
     * - "VOCAB_ONLY"   : Đã pass ngữ pháp, chỉ còn học từ vựng (hiếm)
     * - "HIDDEN"  : Đã pass toàn bộ => ẩn topic này đi
     */
    private String learningStatus;

    /**
     * Tên hiển thị trên UI, đã được tính toán sẵn dựa trên learningStatus:
     * - FULL: "Number • Grammar: Greetings, Names & Age"
     * - GRAMMAR_ONLY: "Grammar: Greetings, Names & Age"
     * - VOCAB_ONLY: "Number"
     * - HIDDEN: null (không hiển thị)
     */
    private String displayTitle;
}
