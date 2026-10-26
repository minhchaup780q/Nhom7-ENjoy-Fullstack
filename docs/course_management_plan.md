# Master Plan: Admin Course Management (CRUD + Draft/Publish Lifecycle)

> **Vai trò:** Principal Software Architect  
> **Dự án:** ENjoy Fullstack (learning-service & enjoy-web)  
> **Mục tiêu:** Thiết lập hệ thống Quản lý khóa học (Topic / Part / Session) dành cho Admin với cơ chế Draft/Publish toàn vẹn dữ liệu, đảm bảo không ảnh hưởng tiến độ học tập của học sinh.  
> **Tài liệu tham chiếu:** Dành cho AI Model (Flash) và Developers triển khai từng bước theo thứ tự.

---

## MỤC LỤC
1. [Tổng quan kiến trúc & Triết lý thiết kế](#1-tổng-quan-kiến-trúc--triết-lý-thiết-kế)
2. [Thiết kế Cơ sở dữ liệu & Migrations](#2-thiết-kế-cơ-sở-dữ-liệu--migrations)
3. [Quy trình Nghiệp vụ CRUD & Edge Cases](#3-quy-trình-nghiệp-vụ-crud--edge-cases)
4. [Cơ chế Publish & Auto-Bridge Unlock](#4-cơ-chế-publish--auto-bridge-unlock)
5. [Contract API Chi tiết (Backend Specification)](#5-contract-api-chi-tiết-backend-specification)
6. [Thiết kế Kiến trúc Frontend (Admin UI)](#6-thiết-kế-kiến-trúc-frontend-admin-ui)
7. [Checklist Công việc Tuần tự (Task Breakdown cho Flash)](#7-checklist-công-việc-tuần-tự-task-breakdown-cho-flash)
8. [Kịch bản Kiểm thử Tích hợp (Integration Test Matrix)](#8-kịch-bản-kiểm-thử-tích-hợp-integration-test-matrix)

---

## 1. Tổng quan kiến trúc & Triết lý thiết kế

### 1.1 Cây phân cấp dữ liệu học tập
Hệ thống quản lý bài học tổ chức theo mô hình cây phân cấp 4 tầng:
```
Level (Cấp độ: A1, A2, B1...)
└── Topic (Chủ đề học)           [is_published, is_delete]
    └── Part (Phần học)          [is_published, is_delete]
        └── Session (Bài học cụ thể) [is_published, has_draft, draft_payload, version, is_delete]
```

### 1.2 Triết lý "Hierarchical Publishing & Draft Payload"
1. **Hierarchical Publishing (Phát hành theo thứ bậc):**
   - Học sinh chỉ nhìn thấy một đơn vị nội dung khi **chính nó và toàn bộ các cấp cha** đều có cờ `is_published = true` và `is_delete = false`.
   - Admin có thể tạo một Topic mới hoàn toàn ở trạng thái DRAFT.
   - Admin cũng có thể tạo thêm Part mới hoặc Session mới ở trạng thái DRAFT **bên trong một Topic đã Publish** mà học sinh không hề nhìn thấy cho đến khi Admin bấm phát hành đơn vị đó.
2. **Draft Payload (Lưu nháp nội dung Session đã phát hành):**
   - Khi Session đã được Publish và đang có học sinh học: Tuyệt đối **không sửa đè trực tiếp** lên cột `payload`.
   - Mọi thay đổi nội dung câu hỏi/từ vựng được lưu vào cột `draft_payload`, đồng thời bật cờ `has_draft = true`.
   - Học sinh vẫn học ổn định với nội dung từ cột `payload` (Live Version).
   - Khi Admin duyệt xong và bấm "Phát hành bản sửa" (Publish Changes): Hệ thống hoán đổi `payload = draft_payload`, dọn sạch `draft_payload = null`, tắt `has_draft = false` và tăng `version` lên 1 đơn vị.
3. **Soft Delete & Auto-Bridge (Xóa mềm và Bắc cầu mở khóa):**
   - Không dùng `DELETE` vật lý (Hard Delete) để bảo toàn lịch sử bảng `user_progress` và `mistakes`.
   - Khi xóa một Session đang ở trạng thái Publish mà có học sinh đang ở trạng thái `UNLOCK` tại Session đó: Hệ thống tự động bắc cầu mở khóa (`UNLOCK`) cho Session tiếp theo còn hoạt động trong Part/Topic.

---

## 2. Thiết kế Cơ sở dữ liệu & Migrations

### 2.1 Cập nhật Bảng `topics`
```sql
ALTER TABLE topics
  ADD COLUMN is_published     BOOLEAN      NOT NULL DEFAULT FALSE COMMENT 'TRUE: Đã phát hành cho học sinh',
  ADD COLUMN published_at     DATETIME     NULL     COMMENT 'Thời điểm phát hành',
  ADD COLUMN published_by     BIGINT       NULL     COMMENT 'ID Admin phát hành';

-- Composite Index phục vụ truy vấn phía học sinh
CREATE INDEX idx_topics_published_delete
  ON topics (level_id, is_published, is_delete, order_index);
```

### 2.2 Cập nhật Bảng `parts`
```sql
ALTER TABLE parts
  ADD COLUMN is_published     BOOLEAN      NOT NULL DEFAULT FALSE COMMENT 'TRUE: Đã phát hành cho học sinh',
  ADD COLUMN published_at     DATETIME     NULL     COMMENT 'Thời điểm phát hành',
  ADD COLUMN published_by     BIGINT       NULL     COMMENT 'ID Admin phát hành';

-- Composite Index phục vụ truy vấn phía học sinh
CREATE INDEX idx_parts_published_delete
  ON parts (topic_id, is_published, is_delete, order_index);
```

### 2.3 Cập nhật Bảng `sessions`
```sql
ALTER TABLE sessions
  ADD COLUMN is_published     BOOLEAN      NOT NULL DEFAULT FALSE COMMENT 'TRUE: Đã phát hành cho học sinh',
  ADD COLUMN draft_payload    JSON         NULL     COMMENT 'Bản nháp nội dung Admin đang sửa (học sinh không thấy)',
  ADD COLUMN has_draft        BOOLEAN      NOT NULL DEFAULT FALSE COMMENT 'Cờ báo có bản nháp chưa phát hành',
  ADD COLUMN version          INT          NOT NULL DEFAULT 1     COMMENT 'Phiên bản nội dung bài học',
  ADD COLUMN published_at     DATETIME     NULL     COMMENT 'Thời điểm phát hành gần nhất',
  ADD COLUMN published_by     BIGINT       NULL     COMMENT 'ID Admin phát hành';

-- Composite Index phục vụ truy vấn phía học sinh
CREATE INDEX idx_sessions_published_delete
  ON sessions (part_id, is_published, is_delete, order_index);

-- Index phục vụ trang quản trị Admin lọc bài có nháp
CREATE INDEX idx_sessions_has_draft
  ON sessions (has_draft, is_published, is_delete);
```

### 2.4 Script Migration Dữ liệu cũ (Backfill)
Toàn bộ dữ liệu hiện tại trước khi có tính năng Admin được xem là các bài học đang chạy hợp lệ:
```sql
-- Đánh dấu toàn bộ dữ liệu hiện tại là đã phát hành
UPDATE topics   SET is_published = TRUE WHERE is_delete = FALSE;
UPDATE parts    SET is_published = TRUE WHERE is_delete = FALSE;
UPDATE sessions SET is_published = TRUE, has_draft = FALSE, version = 1 WHERE is_delete = FALSE;
```

### 2.5 Cập nhật JPA Entities trong `learning-service`
1. **`Topic.java`**: Thêm các thuộc tính `@Column`:
   - `private Boolean isPublished = false;`
   - `private LocalDateTime publishedAt;`
   - `private Long publishedBy;`
2. **`Part.java`**: Thêm tương tự như `Topic.java`.
3. **`Session.java`**: Thêm:
   - `private Boolean isPublished = false;`
   - `@JsonRawValue @Column(columnDefinition = "json", name = "draft_payload") private String draftPayload;`
   - `private Boolean hasDraft = false;`
   - `private Integer version = 1;`
   - `private LocalDateTime publishedAt;`
   - `private Long publishedBy;`
   - `@JsonDeserialize(using = RawJsonDeserializer.class)` cho setter `setDraftPayload(String draftPayload)`.

---

## 3. Quy trình Nghiệp vụ CRUD & Edge Cases

### 3.1 THÊM MỚI (CREATE)

#### Flow 1: Tạo mới Topic (Chủ đề)
- **Input:** `levelId`, `title`, `description`, `thumbnailUrl`.
- **Logic:**
  1. Kiểm tra `levelId` tồn tại và `is_delete = false`.
  2. Tự động tính `orderIndex = COALESCE(MAX(orderIndex), 0) + 1` của Level đó (chỉ thêm vào vị trí sau cùng).
  3. Gán `isPublished = false`, `isDelete = false`.
  4. Lưu DB -> Trả về Topic với trạng thái `DRAFT`.
  5. Học sinh chưa nhìn thấy Topic này.

#### Flow 2: Tạo mới Part trong Topic có sẵn
- **Input:** `topicId`, `title`.
- **Logic:**
  1. Kiểm tra Topic tồn tại và `is_delete = false`.
  2. Tự động tính `orderIndex = COALESCE(MAX(orderIndex), 0) + 1` của Topic đó.
  3. Gán `isPublished = false`, `isDelete = false`.
  4. Lưu DB -> Trả về Part ở trạng thái `DRAFT`.
  5. Dù Topic cha đã Publish, Part mới tạo vẫn ẩn với học sinh.

#### Flow 3: Tạo mới Session trong Part có sẵn
- **Input:** `partId`, `sessionType` (1 trong 10 loại enum), `title`, `description`, `payload` (dữ liệu bài tập ban đầu).
- **Logic:**
  1. Kiểm tra Part tồn tại và `is_delete = false`.
  2. Quy tắc thứ tự: Tự động tính `orderIndex` sau cùng trong Part. (Lưu ý: Session từ vựng thuộc nhóm order 1-5, ngữ pháp thuộc nhóm 6-10).
  3. Gán `isPublished = false`, `hasDraft = false`, `version = 1`.
  4. Lưu trực tiếp vào cột `payload` (vì bài chưa từng publish, chưa cần đến `draft_payload`).

---

### 3.2 SỬA ĐỔI (UPDATE)

#### Phân nhánh 1: Sửa thông tin chung (Metadata) của Topic / Part / Session
- Bao gồm: `title`, `description`, `thumbnailUrl`.
- **Cơ chế:** Sửa trực tiếp (In-place update).
- **Lý do:** Metadata chỉ là tiêu đề/ảnh hiển thị, không làm thay đổi cấu trúc câu hỏi hay đáp án bài học, không ảnh hưởng tính toàn vẹn câu trả lời của học sinh.

#### Phân nhánh 2: Sửa nội dung câu hỏi bài học (Session Payload)
Có 2 kịch bản rõ rệt:

**Kịch bản A: Session chưa từng phát hành (`isPublished = false`)**
- Admin sửa nội dung và bấm "Lưu":
- Hệ thống ghi thẳng vào cột `payload`.
- Cột `draft_payload` giữ `null`, `hasDraft = false`.

**Kịch bản B: Session đang phát hành trực tiếp (`isPublished = true`)**
- Khi Admin mở form sửa:
  - Nếu `hasDraft = true`: Nạp dữ liệu từ `draft_payload`.
  - Nếu `hasDraft = false`: Nạp dữ liệu từ `payload`.
- Khi Admin bấm **"Lưu bản nháp" (Save Draft)**:
  - Ghi dữ liệu vào cột `draft_payload`.
  - Bật cờ `hasDraft = true`.
  - **Giữ nguyên 100% dữ liệu cột `payload`**.
  - Học sinh trên web/app vẫn làm bài bình thường với phiên bản cũ của `payload`.
- Khi Admin bấm **"Hủy bỏ bản nháp" (Discard Draft)**:
  - Xóa `draft_payload = null`.
  - Tắt cờ `hasDraft = false`.
  - Khôi phục nguyên vẹn trạng thái trước khi sửa.

---

### 3.3 XÓA (DELETE - SOFT DELETE ONLY)

#### Flow Xóa Session:
1. Kiểm tra trong `user_progress`:
   - Nếu chưa có học sinh nào học (`progressCount == 0`): Cho phép xóa mềm ngay (`is_delete = true`).
   - Nếu đã có học sinh từng hoàn thành (`FINISH`):
     - Hệ thống yêu cầu xác nhận kèm thống kê: *"Bài học đã có X học sinh hoàn thành. Dữ liệu lịch sử sẽ được bảo lưu nhưng bài học sẽ bị ẩn. Bạn có muốn tiếp tục?"*.
2. **Cơ chế Auto-Bridge Unlock (Bắc cầu mở khóa):**
   - Tìm tất cả học sinh đang có `status = UNLOCK` tại Session sắp xóa.
   - Tìm Session hợp lệ kế tiếp (`is_published = true AND is_delete = false AND orderIndex > current.orderIndex`) trong cùng Part (hoặc Part kế tiếp).
   - Tự động tạo bản ghi `user_progress` với `status = UNLOCK` tại Session kế tiếp cho các học sinh đó, để các em không bị mất luồng học liên tục.
3. Đặt `is_delete = true`, cập nhật `update_at = now()`.

#### Flow Xóa Part / Topic:
- Áp dụng Cascade Soft Delete:
  - Đặt `is_delete = true` cho Part/Topic.
  - Đồng thời đặt `is_delete = true` cho tất cả các Session con thuộc Part/Topic đó.
  - Kích hoạt Auto-Bridge Unlock tương tự nếu có học sinh đang mở khóa tại các session bị xóa.

---

## 4. Cơ chế Publish & Auto-Bridge Unlock

### 4.1 Điều kiện nghiệm thu trước khi Publish (Pre-Publish Validation)
Trước khi cho phép Publish bất kỳ Session nào, hệ thống kiểm tra tính hợp lệ của Payload:
- `payload` (hoặc `draft_payload`) không được rỗng hoặc null.
- Phải parse thành công định dạng JSON.
- Theo từng `SessionType`:
  - `FLASHCARD`, `MATCH_WORD`, `SPEAKING`, `RE_ORDER`, `DRAG_DROP`: Array từ vựng phải có ít nhất 1 item, mỗi item có trường từ và nghĩa.
  - `GRAMMAR`: Payload phải có tiêu đề ngữ pháp và nội dung bài giảng.
  - `FILL_IN_BLANK`, `RE_ORDER_SENTENCE`, `SPEAKING_SENTENCE`, `CONVERSATION`: Danh sách câu hỏi không rỗng, các trường đáp án đúng phải hợp lệ.

### 4.2 Thao tác Publish Session đơn lẻ
1. **Nếu Session là bài học mới (`isPublished = false`):**
   - Validate `payload`.
   - Đặt `isPublished = true`, `publishedAt = now()`, `publishedBy = adminId`.
2. **Nếu Session đang có bản nháp (`isPublished = true AND hasDraft = true`):**
   - Validate `draft_payload`.
   - Thực hiện hoán đổi nguyên tử:
     ```
     payload = draft_payload
     draft_payload = null
     has_draft = false
     version = version + 1
     published_at = now()
     published_by = adminId
     ```
   - Học sinh khi học lần kế tiếp sẽ nhận bản cập nhật mới nhất.

### 4.3 Thao tác Bulk-Publish Part (Phát hành toàn bộ Part)
1. Kiểm tra Part có ít nhất 1 Session hợp lệ.
2. Validate toàn bộ các Session con thuộc Part. Nếu có bài không hợp lệ -> chặn và trả về danh sách lỗi cụ thể của từng bài.
3. Nếu hợp lệ:
   - Cập nhật `is_published = true` cho Part.
   - Cập nhật `is_published = true` cho tất cả Session con đang ở trạng thái DRAFT.
   - **Tự động mở khóa (Unlock First Session):** Tìm các học sinh đã hoàn thành Session cuối cùng của Part trước đó, tự động mở khóa bài đầu tiên của Part này.

### 4.4 Thao tác Bulk-Publish Topic (Phát hành toàn bộ Topic)
1. Kiểm tra Topic có ít nhất 1 Part hợp lệ.
2. Validate toàn bộ cây bài học bên trong.
3. Cập nhật `is_published = true` cho Topic, các Part con và Session con chưa publish.
4. Tự động mở khóa bài học đầu tiên cho học sinh đã hoàn thành Topic liền kề trước đó.

---

## 5. Contract API Chi tiết (Backend Specification)

Toàn bộ API Admin được đặt dưới tiền tố `/api/admin/...` và được bảo vệ bởi quyền `ROLE_ADMIN`.  
Các API hiện tại dành cho học sinh (`/api/topics/...`, `/api/sessions/...`) giữ nguyên path nhưng bổ sung điều kiện lọc `is_published = true`.

### 5.1 Nhóm API Topic Admin
- `GET /api/admin/topics?levelId={levelId}`: Lấy danh sách Topic theo Level (bao gồm cả DRAFT, có thống kê số Part, số Session, badge trạng thái).
- `GET /api/admin/topics/{id}`: Chi tiết 1 Topic.
- `POST /api/admin/topics`: Tạo Topic mới (luôn ở trạng thái DRAFT).
- `PUT /api/admin/topics/{id}/metadata`: Cập nhật tên, mô tả, ảnh thumbnail Topic.
- `POST /api/admin/topics/{id}/publish`: Phát hành Topic (Bulk Publish).
- `DELETE /api/admin/topics/{id}`: Xóa mềm Topic (kèm cảnh báo nếu có học sinh).

### 5.2 Nhóm API Part Admin
- `GET /api/admin/parts?topicId={topicId}`: Lấy danh sách Part theo Topic (kể cả DRAFT).
- `POST /api/admin/parts`: Tạo Part mới (DRAFT).
- `PUT /api/admin/parts/{id}/metadata`: Cập nhật tên Part.
- `POST /api/admin/parts/{id}/publish`: Phát hành Part (Bulk Publish các Session con).
- `DELETE /api/admin/parts/{id}`: Xóa mềm Part.

### 5.3 Nhóm API Session Admin
- `GET /api/admin/sessions?partId={partId}`: Lấy danh sách Session của Part kèm thông tin `isPublished`, `hasDraft`, `version`, số học sinh đã học.
- `GET /api/admin/sessions/{id}`: Chi tiết Session (trả về cả `payload` hiện tại và `draftPayload` nếu có).
- `POST /api/admin/sessions`: Tạo Session mới (DRAFT).
- `PUT /api/admin/sessions/{id}/metadata`: Sửa tiêu đề, mô tả Session.
- `PUT /api/admin/sessions/{id}/draft`: Lưu bản nháp nội dung (`payload`/`draft_payload`).
- `POST /api/admin/sessions/{id}/publish`: Phát hành Session (Áp dụng bản nháp hoặc xuất bản lần đầu).
- `POST /api/admin/sessions/{id}/discard-draft`: Hủy bản nháp đang sửa dở, quay lại bản live.
- `GET /api/admin/sessions/{id}/preview`: Trả về nội dung JSON mới nhất (ưu tiên draft_payload) để màn hình Admin test render.
- `DELETE /api/admin/sessions/{id}`: Xóa mềm Session (+ Auto-Bridge Unlock).

### 5.4 Mẫu DTO Request / Response

#### DTO: Tạo mới Topic (`AdminTopicCreateRequest`)
```json
{
  "levelId": 1,
  "title": "Family and Friends",
  "description": "Từ vựng và mẫu câu về gia đình, bạn bè",
  "thumbnailUrl": "https://cdn.enjoy.vn/images/topics/family.png"
}
```

#### DTO: Lưu nháp Session (`AdminSessionDraftRequest`)
```json
{
  "sessionType": "FLASHCARD",
  "payload": {
    "items": [
      {
        "word": "father",
        "translation": "bố, ba",
        "imageUrl": "https://cdn.enjoy.vn/vocab/father.png",
        "audioUrl": "https://cdn.enjoy.vn/audio/father.mp3"
      }
    ]
  }
}
```

#### DTO: Phản hồi trạng thái Session (`AdminSessionResponse`)
```json
{
  "id": 105,
  "partId": 12,
  "title": "Từ vựng gia đình 1",
  "sessionType": "FLASHCARD",
  "orderIndex": 1,
  "isPublished": true,
  "hasDraft": true,
  "version": 2,
  "badge": "HAS_DRAFT",
  "studentCount": 42,
  "updatedAt": "2026-10-20T16:00:00"
}
```

---

## 6. Thiết kế Kiến trúc Frontend (Admin UI)

### 6.1 Bố cục Cây điều hướng tại `AdminLessons.tsx`
Tổ chức giao diện dạng cây Master-Detail mở rộng (Tree / Accordion List):
- **Cấp 1 - Chọn Level:** Dropdown chọn Level (A1, A2, B1...).
- **Cấp 2 - Topic List:** Danh sách Card hiển thị các Topic.
  - Mỗi Topic Card có: Ảnh đại diện, Tiêu đề, Badge trạng thái (`DRAFT` / `PUBLISHED`), Nút sửa metadata, Nút Publish Topic, Nút Thêm Part mới, Nút Xóa.
- **Cấp 3 - Part List (Bên trong Topic được mở):**
  - Tên Part, Badge trạng thái, Nút Thêm Session mới, Nút Publish Part, Nút Xóa Part.
- **Cấp 4 - Session List (Bên trong Part):**
  - Icon phân loại `SessionType` (Thẻ Flashcard, Nối từ, Nói, Ngữ pháp...).
  - Badge trạng thái 3 màu (xem mục 6.2).
  - Nút thao tác tương ứng theo từng Badge.

### 6.2 Hệ thống Badge trạng thái trực quan
| Trạng thái Badge | Màu sắc giao diện | Điều kiện kỹ thuật | Ý nghĩa với Admin |
| :--- | :--- | :--- | :--- |
| **`DRAFT`** | Nền Vàng cam, chữ cam đậm | `isPublished == false` | Bài học mới tạo, học sinh chưa nhìn thấy. |
| **`PUBLISHED`** | Nền Xanh lá, chữ xanh đậm | `isPublished == true && hasDraft == false` | Đang phát hành ổn định, học sinh đang học. |
| **`HAS_DRAFT`** | Nền Xanh dương, chữ xanh đậm | `isPublished == true && hasDraft == true` | Đang phát hành nhưng Admin đang có bản sửa chưa xuất bản. |

### 6.3 Ma trận Nút thao tác theo trạng thái Session
- Khi là **`DRAFT`**:
  - `[Sửa nội dung]` -> Mở form chỉnh sửa, bấm lưu ghi vào `payload`.
  - `[Xem thử]` -> Xem preview giao diện học sinh.
  - `[Phát hành]` -> Xuất bản cho học sinh.
  - `[Xóa]` -> Xóa mềm bài học.
- Khi là **`PUBLISHED`**:
  - `[Chỉnh sửa]` -> Mở form, dữ liệu được ghi vào `draft_payload`.
  - `[Xem trước]` -> Xem preview bài học live.
  - `[Xóa]` -> Xác nhận cảnh báo ảnh hưởng học sinh.
- Khi là **`HAS_DRAFT`**:
  - `[Tiếp tục sửa nháp]` -> Mở form từ `draft_payload`.
  - `[Xem trước bản nháp]` -> Xem trước bản mới học sinh sẽ nhận.
  - `[Phát hành bản sửa]` -> Đè nháp thành live, tăng version.
  - `[Hủy bỏ bản nháp]` -> Xóa nháp, phục hồi về bản live.

### 6.4 Preview Modal
Khi bấm "Xem trước" (Preview):
- Modal mở ra với tỷ lệ khung hình chuẩn học tập.
- Nạp trực tiếp component `SessionPlayer` (component mà học sinh dùng để học).
- Truyền `payload` (hoặc `draft_payload`) vào Player để Admin trải nghiệm trực tiếp câu hỏi, audio, hiệu ứng mà không cần tạo tiến độ học ảo trong database.

---

## 7. Checklist Công việc Tuần tự (Task Breakdown cho Flash)

Dưới đây là kế hoạch 14 Tasks tuần tự, mô hình AI nhỏ (Flash) chỉ cần nhận từng Task theo thứ tự và thực hiện chính xác:

### Giai đoạn 1: Database & Entities
- **TASK 1: Cập nhật Entities Java (`Topic`, `Part`, `Session`)**
  - *Files:* `learning-service/src/main/java/.../entities/{Topic.java, Part.java, Session.java}`
  - *Nội dung:* Thêm các trường `isPublished`, `publishedAt`, `publishedBy`, `draftPayload`, `hasDraft`, `version`.
  - *Acceptance Criteria:* Compile không lỗi, Hibernate ddl-auto cập nhật cột thành công.
- **TASK 2: Chạy SQL Backfill Dữ liệu cũ & Index**
  - *Files:* Tạo script `Database/migrations/v2_course_management_draft_publish.sql`
  - *Nội dung:* Chạy lệnh UPDATE toàn bộ dữ liệu cũ `is_published = TRUE` và tạo các Composite Index.
  - *Acceptance Criteria:* Toàn bộ Topic/Part/Session cũ đều có `is_published = true`.
- **TASK 3: Cập nhật Repositories với query lọc `is_published`**
  - *Files:* `TopicRepository.java`, `PartRepository.java`, `SessionRepository.java`
  - *Nội dung:* Thêm các method `findBy...AndIsPublishedTrueAndIsDeleteFalseOrderByOrderIndexAsc()`.
  - *Acceptance Criteria:* Có sẵn query phân tách rõ ràng giữa Client (chỉ lấy published) và Admin (lấy tất cả).
- **TASK 4: Cập nhật Service Phía Học sinh (Client Services)**
  - *Files:* `TopicServiceImpl.java`, `PartServiceImpl.java`, `SessionServiceImpl.java`
  - *Nội dung:* Áp dụng query `is_published = true` vào các luồng học tập của học sinh.
  - *Acceptance Criteria:* Màn hình học của học sinh chỉ hiển thị các nội dung đã được phát hành.

### Giai đoạn 2: Admin Backend Services & Controllers
- **TASK 5: Xây dựng bộ DTOs cho Admin Course Management**
  - *Files:* Tạo package `dto/admin` trong `learning-service` chứa các Request/Response DTOs.
  - *Acceptance Criteria:* Đầy đủ validation annotations (`@NotBlank`, `@NotNull`).
- **TASK 6: Xây dựng `AdminCourseService` & Implement (Phần Topic)**
  - *Files:* `services/AdminCourseService.java`, `services/impl/AdminCourseServiceImpl.java`
  - *Nội dung:* `createTopic`, `updateTopicMetadata`, `publishTopic` (Bulk), `deleteTopic`.
  - *Acceptance Criteria:* Topic tạo mới luôn có `is_published = false`, tự tăng orderIndex.
- **TASK 7: Implement Phần Part trong `AdminCourseService`**
  - *Files:* `AdminCourseServiceImpl.java`
  - *Nội dung:* `createPart`, `updatePartMetadata`, `publishPart` (Bulk kèm validation), `deletePart`.
  - *Acceptance Criteria:* Part mới tạo mặc định draft, publish part tự động kích hoạt sessions con hợp lệ.
- **TASK 8: Implement Phần Session & Draft Payload trong `AdminCourseService`**
  - *Files:* `AdminCourseServiceImpl.java`
  - *Nội dung:* `createSession`, `saveDraft`, `publishSession`, `discardDraft`, `previewSession`, `deleteSession` kèm Auto-Bridge Unlock.
  - *Acceptance Criteria:* Sửa session đã publish không ghi đè `payload`, publish changes tăng version và dọn draft.
- **TASK 9: Xây dựng `AdminCourseController`**
  - *Files:* `controllers/AdminCourseController.java`
  - *Nội dung:* Cung cấp đầy đủ các REST endpoints theo Contract API mục 5.
  - *Acceptance Criteria:* Kiểm tra phân quyền Admin, trả về đúng HTTP Status (200, 201, 400, 404).

### Giai đoạn 3: Frontend Admin UI
- **TASK 10: Xây dựng API Client `adminCourseApi.ts`**
  - *Files:* `Web/enjoy-web/src/features/admin/api/adminCourseApi.ts`
  - *Nội dung:* Viết các hàm fetch/axios gọi vào API Admin Course.
  - *Acceptance Criteria:* Type-safe đầy đủ interface TypeScript.
- **TASK 11: Tạo các thành phần nguyên tử (StatusBadge, ActionButtons)**
  - *Files:* `src/features/admin/components/{StatusBadge.tsx, SessionActionButtons.tsx}`
  - *Nội dung:* Hiển thị đúng 3 màu badge và tổ chức ma trận nút hành động.
  - *Acceptance Criteria:* Render trực quan, phản hồi đúng sự kiện click.
- **TASK 12: Xây dựng Modal Form nhập liệu Session theo từng loại**
  - *Files:* `src/features/admin/components/SessionFormModal.tsx` và các form con payload.
  - *Nội dung:* Form dynamic thay đổi theo `session_type` (Flashcard, Grammar, Match word...).
  - *Acceptance Criteria:* Validate form trước khi submit, phân biệt nút "Lưu nháp" và "Phát hành".
- **TASK 13: Xây dựng `PreviewModal` tích hợp Player học tập**
  - *Files:* `src/features/admin/components/PreviewModal.tsx`
  - *Nội dung:* Hiển thị xem trước dữ liệu bài học thực tế.
  - *Acceptance Criteria:* Admin tương tác làm thử bài được mà không làm sai lệch database học sinh.
- **TASK 14: Lắp ráp hoàn thiện `AdminLessons.tsx`**
  - *Files:* `Web/enjoy-web/src/features/admin/components/AdminLessons.tsx`
  - *Nội dung:* Ghép toàn bộ cây Level -> Topic -> Part -> Session, gắn Modal và API handlers.
  - *Acceptance Criteria:* Toàn bộ quy trình Thêm - Sửa - Xóa - Xuất bản hoạt động trơn tru.

---

## 8. Kịch bản Kiểm thử Tích hợp (Integration Test Matrix)

| Mã Case | Tên kịch bản | Thao tác thực hiện | Kết quả kỳ vọng |
| :--- | :--- | :--- | :--- |
| **TC-01** | Tạo Topic mới | Admin tạo Topic "Động vật", bấm Lưu | Topic hiện badge `DRAFT`. Màn hình học sinh **không** thấy Topic này. |
| **TC-02** | Bulk-Publish Topic | Admin bấm "Phát hành Topic" khi chưa có Session nào | Báo lỗi: Topic phải có ít nhất 1 bài học hợp lệ mới được xuất bản. |
| **TC-03** | Thêm Session mới | Thêm Flashcard vào Part, lưu nháp | Session có badge `DRAFT`, học sinh không nhìn thấy. |
| **TC-04** | Xuất bản Session | Bấm "Phát hành" cho Session DRAFT | Session chuyển badge `PUBLISHED`. Học sinh nhìn thấy bài học trên bản đồ. |
| **TC-05** | Sửa Session đang Live | Admin sửa từ vựng của bài đang Live, bấm "Lưu nháp" | Cột `draft_payload` có dữ liệu mới, `payload` cũ giữ nguyên. Badge chuyển `HAS_DRAFT`. Học sinh vẫn học bài với nội dung cũ. |
| **TC-06** | Hủy bỏ bản nháp | Bấm "Hủy nháp" trên bài có badge `HAS_DRAFT` | `draft_payload` bị xóa, badge trở về `PUBLISHED`, nội dung live không bị ảnh hưởng. |
| **TC-07** | Áp dụng bản sửa | Bấm "Phát hành bản sửa" trên bài `HAS_DRAFT` | `payload` cập nhật dữ liệu mới, `version` tăng lên. Học sinh vào học nhận ngay bài mới. |
| **TC-08** | Xóa bài có học sinh đang mở | Xóa Session 2 khi học sinh A đang ở trạng thái `UNLOCK` tại Session 2 | Hệ thống hỏi xác nhận. Sau khi xóa mềm, học sinh A được tự động mở khóa sang Session 3. |
| **TC-09** | Xóa Part bậc thang | Xóa Part 1 có 3 Session con | Part và cả 3 Session con đều nhận `is_delete = true`. Dữ liệu học cũ không bị mất. |
| **TC-10** | Preview bản nháp | Bấm nút "Xem thử" tại bài có bản nháp | Mở Modal Player hiển thị đúng nội dung của `draft_payload`. |

---
*Tài liệu Master Plan đã hoàn tất và sẵn sàng cho việc phân chia triển khai theo từng Task.*
