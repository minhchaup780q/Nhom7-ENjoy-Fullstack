-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Toys (đã tồn tại)
-- PART 2: Toys 2 (order_index = 2)
-- 12 vocab + session 1..4
--   FLASHCARD, MATCH_WORD, SPEAKING, RE_ORDER (không có DRAG_DROP)
-- Chạy chung session với file part 1 (topic + part 1 đã có)
-- Áp dụng AUTO_INCREMENT + LAST_INSERT_ID(), không gán ID cố định
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 0. LẤY LẠI topic_id CỦA TOYS (topic đã tồn tại)
-- ------------------------------------------------------------
SET @topic_toys := (
  SELECT id FROM topics WHERE title = 'Toys' LIMIT 1
);

SELECT @topic_toys AS topic_toys_id;

-- ------------------------------------------------------------
-- 1. TẠO PART 2: Toys 2
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 2, 'Toys 2', @topic_toys);

SET @part_toys_2 := LAST_INSERT_ID();

SELECT @part_toys_2 AS part_toys_2_id;

-- ------------------------------------------------------------
-- 2. VOCABULARIES (12 từ)
-- ------------------------------------------------------------

-- ship
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=ship&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/ship.webp',
 'tàu thủy', 'ship');
SET @v_ship := LAST_INSERT_ID();

-- computer
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=computer&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/computer.webp',
 'máy tính', 'computer');
SET @v_computer := LAST_INSERT_ID();

-- balloon
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=balloon&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/balloon.webp',
 'quả bóng bay', 'balloon');
SET @v_balloon := LAST_INSERT_ID();

-- keyboard
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=keyboard&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/keyboard.webp',
 'bàn phím', 'keyboard');
SET @v_keyboard := LAST_INSERT_ID();

-- mouse
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=mouse&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/mouse.webp',
 'con chuột', 'mouse');
SET @v_mouse := LAST_INSERT_ID();

-- board game
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=board+game&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/board_game.webp',
 'trò chơi cờ bàn', 'board game');
SET @v_board_game := LAST_INSERT_ID();

-- helicopter
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=helicopter&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/helicopter.webp',
 'trực thăng', 'helicopter');
SET @v_helicopter := LAST_INSERT_ID();

-- teddy
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=teddy&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/teddy.webp',
 'gấu bông', 'teddy');
SET @v_teddy := LAST_INSERT_ID();

-- radio
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=radio&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/radio.webp',
 'đài radio', 'radio');
SET @v_radio := LAST_INSERT_ID();

-- box
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=box&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/box.webp',
 'cái hộp', 'box');
SET @v_box := LAST_INSERT_ID();

-- old
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=old&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/old.webp',
 'cũ', 'old');
SET @v_old := LAST_INSERT_ID();

-- new
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=new&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/new.webp',
 'mới', 'new');
SET @v_new := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 3. PART_VOCABULARIES (nối part Toys 2 với 12 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_toys_2, @v_ship),
(NOW(), 1, 0, NOW(), 1, 2,  @part_toys_2, @v_computer),
(NOW(), 1, 0, NOW(), 1, 3,  @part_toys_2, @v_balloon),
(NOW(), 1, 0, NOW(), 1, 4,  @part_toys_2, @v_keyboard),
(NOW(), 1, 0, NOW(), 1, 5,  @part_toys_2, @v_mouse),
(NOW(), 1, 0, NOW(), 1, 6,  @part_toys_2, @v_board_game),
(NOW(), 1, 0, NOW(), 1, 7,  @part_toys_2, @v_helicopter),
(NOW(), 1, 0, NOW(), 1, 8,  @part_toys_2, @v_teddy),
(NOW(), 1, 0, NOW(), 1, 9,  @part_toys_2, @v_radio),
(NOW(), 1, 0, NOW(), 1, 10, @part_toys_2, @v_box),
(NOW(), 1, 0, NOW(), 1, 11, @part_toys_2, @v_old),
(NOW(), 1, 0, NOW(), 1, 12, @part_toys_2, @v_new);

-- ------------------------------------------------------------
-- 4. SESSIONS (4 vòng, payload NULL)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard toys vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Toys', @part_toys_2);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word toys vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Toys', @part_toys_2);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking toys vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Toys', @part_toys_2);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order toys vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Toys', @part_toys_2);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================