# 📑 TÀI LIỆU ĐẶC TẢ NGHIỆP VỤ & API CONTRACT HỆ THỐNG ENJOY

---

## 1. 👨‍👩‍👧 Chức Năng Quản Lý & Liên Kết Gia Đình (Family Management)

### 📌 Ràng buộc nghiệp vụ (Business Rules)
- **Quyền gửi lời mời**: Chỉ tài khoản có vai trò **`ROLE_PARENT` (Phụ huynh)** mới được gửi lời mời liên kết.
- **Đối tượng nhận**: Email được mời phải thuộc tài khoản **`ROLE_CHILDREN` (Học sinh)** đang tồn tại trong hệ thống.
- **Ràng buộc trùng lặp**:
  - Không được tự mời chính mình (`parentEmail == studentEmail`).
  - Không gửi mời nếu 2 tài khoản đã có trạng thái `LINKED`.
- **Cơ chế OTP**:
  - Hệ thống sinh mã OTP ngẫu nhiên **6 chữ số** (VD: `849201`).
  - Mã có hiệu lực trong vòng **24 giờ** (`expires_at = now + 24h`).
  - `user-service` gọi OpenFeign sang `auth-service` để gửi email HTML thông báo kèm mã xác nhận đến Gmail học sinh.
- **Xác nhận liên kết**: Học sinh nhập đúng 6 số OTP trong vòng 24h -> Trạng thái chuyển thành `LINKED`.

---

### 📡 API Contracts

#### 1.1. Phụ huynh gửi lời mời liên kết con cái
- **Endpoint**: `POST /api/user/family/invite`
- **Header**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "studentEmail": "conyeu@gmail.com"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "id": 1,
    "parentId": 10,
    "parentName": "Nguyễn Văn Ba",
    "parentEmail": "ba.nguyen@gmail.com",
    "studentId": 25,
    "studentName": "Nguyễn Văn Con",
    "studentEmail": "conyeu@gmail.com",
    "status": "PENDING",
    "expiresAt": "2026-09-02T18:00:00",
    "createdAt": "2026-09-01T18:00:00"
  }
  ```

#### 1.2. Học sinh xác thực mã OTP liên kết
- **Endpoint**: `POST /api/user/family/verify`
- **Header**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "verificationCode": "849201"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "id": 1,
    "parentId": 10,
    "parentName": "Nguyễn Văn Ba",
    "parentEmail": "ba.nguyen@gmail.com",
    "studentId": 25,
    "studentName": "Nguyễn Văn Con",
    "studentEmail": "conyeu@gmail.com",
    "status": "LINKED",
    "expiresAt": null,
    "createdAt": "2026-09-01T18:00:00"
  }
  ```

#### 1.3. Lấy danh sách tổng quan gia đình (Overview)
- **Endpoint**: `GET /api/user/family/overview`
- **Header**: `Authorization: Bearer <token>`
- **Response (`200 OK`)**:
  ```json
  {
    "linkedMembers": [
      {
        "id": 1,
        "parentId": 10,
        "parentName": "Nguyễn Văn Ba",
        "parentEmail": "ba.nguyen@gmail.com",
        "studentId": 25,
        "studentName": "Nguyễn Văn Con",
        "studentEmail": "conyeu@gmail.com",
        "status": "LINKED"
      }
    ],
    "pendingInvites": [
      {
        "id": 2,
        "studentEmail": "con2@gmail.com",
        "status": "PENDING",
        "expiresAt": "2026-09-02T18:30:00"
      }
    ]
  }
  ```

#### 1.4. Học sinh từ chối lời mời
- **Endpoint**: `POST /api/user/family/reject/{familyId}`
- **Header**: `Authorization: Bearer <token>`
- **Response (`200 OK`)**: `{}`

#### 1.5. Hủy lời mời hoặc Hủy liên kết gia đình
- **Endpoint**: `DELETE /api/user/family/{familyId}`
- **Header**: `Authorization: Bearer <token>`
- **Response (`200 OK`)**: `{}`

---

## 2. 🎂 Chức Năng Đổi Ngày Sinh & Tự Động Map Vai Trò (Role & Birthday Sync)

### 📌 Ràng buộc nghiệp vụ (Business Rules)
- **Quy tắc phân loại độ tuổi**:
  - Tuổi $\le 16$: Vai trò tự động chuyển thành **`ROLE_CHILDREN` (Học sinh)**.
  - Tuổi $> 16$: Vai trò tự động chuyển thành **`ROLE_PARENT` (Phụ huynh)**.
  - Ngoại lệ: Tài khoản có role `ROLE_ADMIN` giữ nguyên quyền quản trị, không bị thay đổi theo tuổi.
- **Ràng buộc UI**:
  - Khi thay đổi ngày sinh trên Date Picker, giao diện **chưa thay đổi ngay** cho đến khi người dùng bấm nút **`LƯU THAY ĐỔI`**.
  - Không cho phép chọn ngày sinh ở tương lai (`birthday <= today`).
  - Khi bấm lưu thành công, Backend tự động cập nhật lại `role` trong DB và Frontend đồng bộ lại menu **Cài đặt** (`Quản lý gia đình` $\leftrightarrow$ `Liên kết gia đình`).

---

### 📡 API Contracts
- **Endpoint**: `PUT /api/user/profile`
- **Header**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "username": "Nguyễn Hoàng Tân",
    "birthday": "2015-05-20",
    "avatarUrl": "avatar_1.png"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "id": 15,
    "email": "hoangtan@gmail.com",
    "username": "Nguyễn Hoàng Tân",
    "birthday": "2015-05-20",
    "role": "ROLE_CHILDREN",
    "avatarUrl": "avatar_1.png"
  }
  ```

---

## 3. 🎙️ Chức Năng Nhận Diện & Chấm Điểm Phát Âm AI (Speech Assessment)

### 📌 Ràng buộc nghiệp vụ (Business Rules)
- **Công nghệ**: Sử dụng Faster-Whisper Model (Microservice Python FastAPI, port `8000`).
- **Định dạng âm thanh**: File `.webm` hoặc `.wav` ghi âm trực tiếp từ microphone trình duyệt.
- **Tiêu chuẩn đánh giá**:
  - So sánh danh sách từ nhận diện được (`recognized_words`) với câu/từ chuẩn (`target_sentence`) bằng thuật toán `SequenceMatcher`.
  - Từ nào phát âm đúng $\rightarrow$ trạng thái `correct` (UI tô **xanh lá**).
  - Từ nào phát âm sai hoặc thiếu $\rightarrow$ trạng thái `wrong` (UI tô **đỏ**).
  - **Điều kiện Đúng toàn câu (`isAllCorrect = true`)**: $100\%$ các từ trong câu phải đạt trạng thái `correct`.
- **Xử lý khi phát âm sai hoặc lỗi kết nối**:
  - Trừ **1 Tim** (`hearts - 1`).
  - Ghi nhận lỗi phát âm vào hệ thống `learning-service` (`logMistake`) để đưa vào kho ôn tập từ sai.

---

### 📡 API Contracts
- **Endpoint**: `POST /api/v1/speech/assess`
- **Content-Type**: `multipart/form-data`
- **Request Form Data**:
  | Key | Kiểu | Mô tả |
  | :--- | :--- | :--- |
  | `audio` | `File (Blob)` | File âm thanh người dùng ghi âm (`recording.webm`) |
  | `target_sentence` | `String` | Từ/câu mẫu cần đọc (VD: `"Apple"`, `"Good morning"`) |

- **Response (`200 OK`)**:
  ```json
  {
    "isAllCorrect": true,
    "accuracyScore": 100.0,
    "recognizedText": "apple",
    "details": [
      {
        "word": "Apple",
        "status": "correct"
      }
    ]
  }
  ```

---

## 4. 🎮 Chức Năng Học Tập Qua Các Vòng (Session Player Flow)

### 📌 Ràng buộc nghiệp vụ (Business Rules)
- **Số lượng vòng trong 1 bài học (Session Type)**:
  1. **Vòng 1 (INTRODUCTION)**: Giới thiệu từ vựng, hình ảnh, phát âm mẫu $\rightarrow$ Người học nghe xong bấm tiếp tục là hoàn thành ($100\%$ pass).
  2. **Vòng 2 (LISTENING)**: Nghe phát âm và chọn 1 trong 4 hình ảnh minh họa tương ứng $\rightarrow$ Chọn đúng ảnh = Đúng.
  3. **Vòng 3 (SPEAKING)**: Nhìn từ vựng, bấm micro thu âm và phát âm $\rightarrow$ AI Whisper chấm điểm từng từ ($100\%$ từ đúng = Pass).
  4. **Vòng 4 (WORD_RECOGNITION / FILL_IN_BLANK)**: Điền từ còn thiếu vào chỗ trống bằng cách chọn từ xáo trộn $\rightarrow$ Điền đúng toàn bộ các ô = Đúng.
  5. **Vòng 5 (GAMIFIED_REVIEW)**: Vòng tổng hợp trò chơi thử thách kết hợp các dạng bài.
- **Điều kiện Hoàn thành bài học (Session Pass Criteria)**:
  - Người học phải trả lời lần lượt qua hết tất cả các câu hỏi trong Session (`currentStepIndex == totalSteps`).
  - Số lượng tim còn lại phải $> 0$ (Mỗi người có tối đa 5 tim, mỗi lần trả lời sai bị trừ 1 tim).
  - Khi hoàn thành câu cuối cùng với số tim $> 0$ $\rightarrow$ Hệ thống gọi API `completeUserSession(sessionId)` để:
    - Mở khóa bài học kế tiếp (`UNLOCK`).
    - Cộng điểm kinh nghiệm (EXP) và cập nhật tiến độ học của User.

---

### 📡 API Contracts

#### 4.1. Lấy danh sách câu hỏi trong bài học
- **Endpoint**: `GET /api/sessions/{sessionId}/items`
- **Response (`200 OK`)**:
  ```json
  [
    {
      "id": 101,
      "sessionId": 1,
      "orderIndex": 1,
      "item": {
        "id": 50,
        "contentText": "Apple",
        "translation": "Quả táo",
        "imageUrl": "/uploads/images/apple.png",
        "audioUrl": "/uploads/audio/apple.mp3",
        "itemType": "FLASHCARD"
      }
    }
  ]
  ```

#### 4.2. Đánh dấu hoàn thành Session và mở khóa bài tiếp theo
- **Endpoint**: `POST /api/progress/complete/{sessionId}`
- **Header**: `Authorization: Bearer <token>`
- **Response (`200 OK`)**:
  ```json
  {
    "id": 1,
    "userId": 15,
    "sessionId": 1,
    "status": "COMPLETED",
    "score": 100,
    "unlockedNextSessionId": 2
  }
  ```

#### 4.3. Ghi nhận lỗi sai khi làm bài (Mistake Logging)
- **Endpoint**: `POST /api/mistakes/log`
- **Header**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "questionId": 50,
    "roundType": 3,
    "wrongAnswerSubmitted": "e-po",
    "durationSeconds": 6
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "id": 1,
    "message": "Ghi nhận lỗi sai thành công"
  }
  ```

---

## 5. 🔐 Chức Năng Đăng Ký & Đăng Nhập (Authentication & Age Verification)

### 📌 Ràng buộc nghiệp vụ (Business Rules)
- **Đăng ký (`/api/auth/register`)**:
  - Nhập: `email`, `password`, `username`, `birthday`.
  - Hệ thống tính tuổi ngay tại lúc đăng ký:
    - Tuổi $\le 16 \rightarrow$ Gán `ROLE_CHILDREN`.
    - Tuổi $> 16 \rightarrow$ Gán `ROLE_PARENT`.
  - Lưu thông tin tạm thời và mã OTP vào **Redis** (hết hạn sau **5 phút**).
  - Gửi email OTP xác thực tài khoản qua Gmail.
- **Xác thực OTP (`/api/auth/verify-otp`)**:
  - Người dùng nhập mã 6 số từ email.
  - Hệ thống so khớp OTP từ Redis $\rightarrow$ Tạo tài khoản trong bảng `accounts` (`auth-service`) và tự động gọi OpenFeign sang `user-service` để tạo profile người dùng.

---

### 📡 Bảng Tổng Hợp Mã Lỗi (Error Handling Standards)

| Mã HTTP | Tình huống | Ý nghĩa |
| :--- | :--- | :--- |
| **`400 Bad Request`** | Dữ liệu không hợp lệ | Mã OTP sai/hết hạn, email trùng lặp, ngày sinh tương lai |
| **`401 Unauthorized`** | Chưa đăng nhập / Token hết hạn | Token không hợp lệ hoặc thiếu Bearer token |
| **`403 Forbidden`** | Không có quyền | Học sinh cố gửi lời mời gia đình, thao tác trên lời mời của người khác |
| **`404 Not Found`** | Không tìm thấy | Không tìm thấy email học sinh, bài học không tồn tại |
| **`500 Internal Error`**| Lỗi hệ thống máy chủ | Lỗi SMTP gửi mail, lỗi model AI Faster-Whisper |
