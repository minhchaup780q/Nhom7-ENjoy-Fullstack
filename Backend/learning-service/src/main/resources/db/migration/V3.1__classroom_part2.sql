-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Classroom (đã tồn tại)
-- Tạo PART 2: Classroom 2 (order_index = 2)
-- Part chỉ có vocab => session 1..4 (FLASHCARD, MATCH_WORD, SPEAKING, RE_ORDER)
-- Áp dụng AUTO_INCREMENT + LAST_INSERT_ID(), không gán ID cố định
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 0. LẤY LẠI topic_id CỦA CLASSROOM (topic đã tồn tại)
--    Vì topic không insert trong script này nên không dùng LAST_INSERT_ID()
-- ------------------------------------------------------------
SET @topic_classroom := (
  SELECT id FROM topics WHERE title = 'Classroom' LIMIT 1
);

-- Kiểm tra: phải ra một số, không NULL. Nếu NULL => sai title topic.
SELECT @topic_classroom AS topic_classroom_id;

-- ------------------------------------------------------------
-- 1. TẠO PART 2 (Classroom 2)
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 2, 'Classroom 2', @topic_classroom);

SET @part_classroom_2 := LAST_INSERT_ID();

-- Kiểm tra: phải ra một số, không NULL
SELECT @part_classroom_2 AS part_classroom_2_id;

-- ------------------------------------------------------------
-- 2. VOCABULARIES (9 từ)
-- ------------------------------------------------------------

-- board
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=board&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/board.webp',
 'bảng', 'board');
SET @v_board := LAST_INSERT_ID();

-- bookcase
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=bookcase&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/bookcase.webp',
 'tủ sách', 'bookcase');
SET @v_bookcase := LAST_INSERT_ID();

-- cupboard
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=cupboard&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/cupboard.webp',
 'tủ đựng đồ', 'cupboard');
SET @v_cupboard := LAST_INSERT_ID();

-- door
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=door&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/door.webp',
 'cửa ra vào', 'door');
SET @v_door := LAST_INSERT_ID();

-- paper
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=paper&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/paper.webp',
 'tờ giấy', 'paper');
SET @v_paper := LAST_INSERT_ID();

-- playground
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=playground&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/playground.webp',
 'sân chơi / sân trường', 'playground');
SET @v_playground := LAST_INSERT_ID();

-- ruler
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=ruler&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/ruler.webp',
 'thước kẻ', 'ruler');
SET @v_ruler := LAST_INSERT_ID();

-- wall
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=wall&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/wall.webp',
 'bức tường', 'wall');
SET @v_wall := LAST_INSERT_ID();

-- window
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=window&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/window.webp',
 'cửa sổ', 'window');
SET @v_window := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 3. PART_VOCABULARIES (nối part Classroom 2 với 9 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, @part_classroom_2, @v_board),
(NOW(), 1, 0, NOW(), 1, 2, @part_classroom_2, @v_bookcase),
(NOW(), 1, 0, NOW(), 1, 3, @part_classroom_2, @v_cupboard),
(NOW(), 1, 0, NOW(), 1, 4, @part_classroom_2, @v_door),
(NOW(), 1, 0, NOW(), 1, 5, @part_classroom_2, @v_paper),
(NOW(), 1, 0, NOW(), 1, 6, @part_classroom_2, @v_playground),
(NOW(), 1, 0, NOW(), 1, 7, @part_classroom_2, @v_ruler),
(NOW(), 1, 0, NOW(), 1, 8, @part_classroom_2, @v_wall),
(NOW(), 1, 0, NOW(), 1, 9, @part_classroom_2, @v_window);

-- ------------------------------------------------------------
-- 4. SESSIONS (4 vòng, part chỉ có vocab => order 1..4)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard classroom vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Classroom', @part_classroom_2);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word classroom vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Classroom', @part_classroom_2);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking classroom vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Classroom', @part_classroom_2);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order classroom vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Classroom', @part_classroom_2);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================