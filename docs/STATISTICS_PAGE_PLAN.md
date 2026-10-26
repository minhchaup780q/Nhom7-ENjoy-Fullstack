# Kế Hoạch Xây Dựng Trang Thống Kê & Theo Dõi Từ Vựng

## 1. Thiết kế Giao Diện (Frontend)
- **Vị trí**: Thay thế trang Thống kê hiện tại trong menu.
- **Bố cục UI** (dựa theo thiết kế tham khảo):
  - **Header**: Tiêu đề "Mỗi ngày học, một bước tiến" và "Tổng quan", "Lịch sử bài thi".
  - **Khối Target**: Dữ liệu fake tĩnh (Listening, Reading + Writing, icon sao).
  - **Khối Progress**: Dữ liệu fake tĩnh (Ví dụ: 68% - 8/12 bài học đã hoàn thành).
  - **Khối Knowledge mastery (Trọng tâm)**:
    - **Empty State**: Nếu chưa có lịch sử làm bài -> Hiển thị thông báo "Hãy làm bài kiểm tra để theo dõi sự tiến bộ!".
    - **Bảng Topic (Dữ liệu THẬT)**:
      - Các cột: `Tên topic` | `Cần cải thiện` | `Đã cải thiện` | `Status` | `Action`
      - **Cần cải thiện**: Số lượng từ thuộc trạng thái `WEAK`.
      - **Đã cải thiện**: Số lượng từ thuộc trạng thái `CORRECT`.
      - **Status**: 
        - `Developing` (Đang phát triển): Đã cải thiện > Cần cải thiện.
        - `Weak` (Cần cố gắng): Cần cải thiện >= Đã cải thiện.
      - **Action**: Nút "Luyện tập" (UI button, chưa gắn sự kiện).
    - **Bảng Grammar**: Dữ liệu fake tĩnh (Have got, To be, There is/are...).
  - **Khối Skill**: Dữ liệu fake tĩnh dạng bảng/biểu đồ tiến độ kỹ năng (Listening, Reading, Speaking).

## 2. Thiết Kế Cơ Sở Dữ Liệu (Backend - Database)
Tạo một bảng mới để lưu vết từ vựng của user: `user_vocabulary_tracking`.
- **Fields**:
  - `id`: PK (UUID/Long)
  - `user_id`: Định danh người dùng
  - `word`: Từ vựng (lowercase)
  - `topic`: Chủ đề của từ vựng đó (lấy từ `MockVocabularyRepository`)
  - `status`: Enum (`WEAK`, `CORRECT`)
  - `created_at`, `updated_at`: Theo dõi thời gian.
- **Quy tắc lưu trữ**:
  - Từ vựng mặc định làm đúng ngay từ đầu: **KHÔNG** lưu vào bảng.
  - Sai lần đầu: Thêm mới bản ghi -> `status = WEAK`.
  - Sai lại từ đã có trong bảng: Cập nhật `updated_at`, giữ nguyên `status = WEAK`.
  - Làm đúng một từ đã có trong bảng: Cập nhật `status = CORRECT`.
  - Làm sai lại một từ đang `CORRECT`: Cập nhật `status = WEAK`.

## 3. Xử Lý Logic Trích Xuất Từ Vựng (Backend - Service)
Khi người dùng **nộp bài kiểm tra** (Submit Exam), hệ thống sẽ quét các đáp án để thu thập 2 danh sách: `wrongWords` (Các từ làm sai) và `correctWords` (Các từ làm đúng). 

Quy tắc bóc tách từ vựng theo cấu trúc đề thi:
- **Listening Part 2**: Các keyword dạng text user phải điền (Ví dụ: tên, số, từ vựng ngắn).
- **Listening Part 4**: Tên các màu sắc user phải tô/chọn sai.
- **Reading Part 1**: Từ vựng ở vị trí cuối câu (keyword mô tả định nghĩa).
- **Reading Part 3**: Các từ vựng yêu cầu user sắp xếp lại chữ cái.
- **Reading Part 4**: Các từ vựng điền vào chỗ trống trong đoạn văn.

**Luồng xử lý logic sau khi có `wrongWords` và `correctWords`**:
1. Duyệt danh sách `wrongWords`:
   - Tìm `topic` của từ qua `MockVocabularyRepository`. Nếu thuộc một topic -> Update hoặc Insert vào DB với `status = WEAK`.
2. Duyệt danh sách `correctWords`:
   - Tìm `topic` của từ. Query vào DB xem user này đã từng sai từ này chưa (có bản ghi trong bảng).
   - Nếu có bản ghi trong DB -> Update `status = CORRECT`. (Không có thì bỏ qua).

## 4. API Backend Cần Xây Dựng
1. **API Tính toán và Cập nhật từ vựng**: 
   - Hàm này sẽ chạy ngầm ngay sau khi chấm điểm bài thi xong trong API Submit Exam hiện tại.
2. **API Lấy Thống Kê Topic**: `GET /api/v1/statistics/topics?userId={userId}`
   - Aggregate data từ bảng `user_vocabulary_tracking` theo `user_id`.
   - Trả về JSON list các topic kèm số lượng `weak` (Cần cải thiện) và `correct` (Đã cải thiện). Dựa vào đó để tính `Status`.

## 5. Các Bước Triển Khai Thực Tế
- **Bước 1**: Tạo Entity, Repository cho `user_vocabulary_tracking` trong Spring Boot.
- **Bước 2**: Bổ sung hàm bóc tách từ vựng `wrongWords` và `correctWords` trong `ExamServiceImpl`.
- **Bước 3**: Viết logic lưu DB sau khi chấm điểm.
- **Bước 4**: Viết API GET trả về số liệu thống kê.
- **Bước 5**: Lên giao diện React (UI Thống kê) theo thiết kế, mock các khối dữ liệu tĩnh.
- **Bước 6**: Tích hợp API gọi dữ liệu Topic thật vào Frontend. Xử lý Empty State.
