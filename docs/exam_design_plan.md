# Kế Hoạch Thiết Kế Bảng Đề Thi (Exams) & Lịch Sử (Exam Histories)

Tài liệu này định nghĩa cấu trúc cơ sở dữ liệu và JSON payload cho hệ thống bài thi Pre-A1 Starters.

---

## 1. Bảng `exams` (Định nghĩa Đề Thi)
Bảng này lưu trữ cấu trúc tĩnh của đề thi, áp dụng chung cho tất cả học sinh trên hệ thống.

### Thông tin các cột
- **`id`** (BIGINT, PK): ID đề thi
- **`exam_type`** (VARCHAR/ENUM): Nguồn gốc/Loại đề thi (VD: `CAMBRIDGE`, `COLLINS`, `CUSTOM`)
- **`title`** (VARCHAR): Tên bài thi (VD: "Cambridge Pre-A1 Starters - Test 1")
- **`description`** (TEXT): Mô tả ngắn
- **`level`** (VARCHAR): Cấp độ (VD: "PRE_A1")
- **`listening_duration`** (INT): Thời gian làm bài nghe (phút)
- **`reading_duration`** (INT): Thời gian làm bài đọc viết (phút)
- **`listening_payload`** (JSON): Lưu cấu trúc đề thi phần Listening (4 parts)
- **`reading_payload`** (JSON): Lưu cấu trúc đề thi phần Reading & Writing (5 parts)
- **`total_listening_questions`** (INT): Tổng số câu hỏi phần nghe (Thường là 20)
- **`total_reading_questions`** (INT): Tổng số câu hỏi phần đọc viết (Thường là 25)

*(Không bao gồm trạng thái "đã làm/chưa làm" vì đây là dữ liệu chung)*

---

## 2. Bảng `exam_histories` (Lịch Sử & Kết Quả Làm Bài)
Bảng này lưu lịch sử làm bài của từng học sinh.

### Phương pháp chấm điểm
Backend sẽ tự động duyệt toàn bộ đáp án của học sinh lúc nộp bài, tính điểm, kiểm tra đúng/sai và lưu kết quả một lần duy nhất. Tránh việc load đề gốc lên rồi mới tính toán khi học sinh xem lại lịch sử.

### Thông tin các cột
- **`id`** (BIGINT, PK): ID lượt thi
- **`user_id`** (BIGINT): ID học sinh
- **`exam_id`** (BIGINT, FK): Liên kết đến bảng `exams`
- **`total_correct`** (INT): Tổng số câu đúng toàn bài (Listening + Reading)
- **`total_questions`** (INT): Tổng số câu của đề thi (Copy từ exams qua để tiện thống kê)
- **`listening_shields`** (INT): Số khiên đạt được phần Nghe (0 - 5)
- **`reading_shields`** (INT): Số khiên đạt được phần Đọc & Viết (0 - 5)
- **`part_scores_payload`** (JSON): Cấu trúc lưu số lượng câu đúng / tổng số câu của từng Part.
- **`answers_payload`** (JSON): Cấu trúc chi tiết lưu lại câu trả lời và trạng thái đúng/sai của từng câu để phục hồi giao diện trang Review.
- **`completed_at`** (DATETIME): Thời gian hoàn thành

---

## 3. Cấu trúc JSON chi tiết

### 3.1. Cột `part_scores_payload` (Dùng vẽ bảng điểm chi tiết)
```json
{
  "listening": {
    "part_1": { "correct": 5, "total": 5 },
    "part_2": { "correct": 3, "total": 5 },
    "part_3": { "correct": 5, "total": 5 },
    "part_4": { "correct": 4, "total": 5 }
  },
  "reading": {
    "part_1": { "correct": 5, "total": 5 },
    "part_2": { "correct": 5, "total": 5 },
    "part_3": { "correct": 4, "total": 5 },
    "part_4": { "correct": 5, "total": 5 },
    "part_5": { "correct": 5, "total": 5 }
  }
}
```

### 3.2. Cột `answers_payload` (Dùng để load trang Xem Lại Bài - Review Mode)
```json
{
  "listening": [
    {
      "part_number": 1,
      "type": "MATCHING",
      "user_answers": [
        { "name": "Lucy", "line_to": "girl_with_cat", "is_correct": true },
        { "name": "Tom", "line_to": "boy_running", "is_correct": false, "correct_answer": "boy_eating" }
      ]
    },
    {
      "part_number": 2,
      "type": "FILL_BLANK",
      "user_answers": [
        { "question_id": 1, "input": "Kim", "is_correct": true },
        { "question_id": 2, "input": "7", "is_correct": false, "correct_answer": "8" }
      ]
    }
  ],
  "reading": [
    {
      "part_number": 1,
      "type": "TICK_CROSS",
      "user_answers": [
        { "question_id": 1, "choice": "tick", "is_correct": true },
        { "question_id": 2, "choice": "cross", "is_correct": false, "correct_answer": "tick" }
      ]
    }
  ]
}
```

---

## 4. Bảng Quy Đổi Khiên (Shields Conversion Logic)
Được Backend sử dụng lúc tính điểm (Submit API):

| Tỷ lệ phần trăm đúng | Số Khiên (Shields) | Giải thích |
|----------------------|--------------------|------------|
| 90% - 100% | 5 | Xuất sắc |
| 75% - 89% | 4 | Tốt |
| 50% - 74% | 3 | Khá |
| 25% - 49% | 2 | Cần cố gắng |
| 0% - 24% | 1 | Yếu |

*Công thức áp dụng độc lập cho 2 kỹ năng: Nghe và Đọc.*
