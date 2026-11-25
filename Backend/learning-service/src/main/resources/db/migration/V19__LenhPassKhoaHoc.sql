USE `enjoy_learning_db`;

-- 1. Đặt User ID của tài khoản bạn đang đăng nhập để test
SET @USER_ID = 1;

-- 2. Tự động lấy tất cả các vòng trong bảng sessions và đánh dấu FINISH
INSERT INTO `user_progress` 
  (`user_id`, `session_id`, `status`, `completed_at`, `duration_seconds`, `create_at`, `update_at`, `create_by`, `update_by`, `is_delete`)
SELECT 
  @USER_ID, id, 'FINISH', NOW(), 120, NOW(), NOW(), @USER_ID, @USER_ID, 0
FROM `sessions`
ON DUPLICATE KEY UPDATE 
  `status` = 'FINISH',
  `completed_at` = NOW(),
  `duration_seconds` = 120,
  `update_at` = NOW();
