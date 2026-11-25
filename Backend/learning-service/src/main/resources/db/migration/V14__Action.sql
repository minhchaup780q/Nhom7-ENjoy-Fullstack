-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Action (tạo mới)
-- 1 part duy nhất: Action
-- 9 vocab + session 1..4
--   FLASHCARD, MATCH_WORD, SPEAKING, RE_ORDER (không có DRAG_DROP)
-- Áp dụng AUTO_INCREMENT + LAST_INSERT_ID(), không gán ID cố định
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 0. LẤY LẠI level_id PRE_A1 (level đã tồn tại)
-- ------------------------------------------------------------
SET @level_pre_a1 := (
  SELECT id FROM levels WHERE code = 'PRE_A1' LIMIT 1
);

SELECT @level_pre_a1 AS level_pre_a1_id;

-- ------------------------------------------------------------
-- 1. TOPIC: Action (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Action verbs', 14,
 'https://example.com/placeholder-action-thumbnail.webp',
 'Action', @level_pre_a1);

SET @topic_action := LAST_INSERT_ID();

SELECT @topic_action AS topic_action_id;

-- ------------------------------------------------------------
-- 2. PART: Action
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Action', @topic_action);

SET @part_action := LAST_INSERT_ID();

SELECT @part_action AS part_action_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (9 từ)
-- ------------------------------------------------------------

-- clean
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=clean&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Action/clean.webp',
 'dọn dẹp', 'clean');
SET @v_clean := LAST_INSERT_ID();

-- close
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=close&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Action/close.webp',
 'đóng', 'close');
SET @v_close := LAST_INSERT_ID();

-- give
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=give&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Action/give.webp',
 'đưa', 'give');
SET @v_give := LAST_INSERT_ID();

-- look at
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=look+at&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Action/look_at.webp',
 'nhìn', 'look at');
SET @v_look_at := LAST_INSERT_ID();

-- open
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=open&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Action/open.webp',
 'mở', 'open');
SET @v_open := LAST_INSERT_ID();

-- pick up
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=pick+up&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Action/pick_up.webp',
 'nhặt', 'pick up');
SET @v_pick_up := LAST_INSERT_ID();

-- point to
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=point+to&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Action/point_to.webp',
 'chỉ vào', 'point to');
SET @v_point_to := LAST_INSERT_ID();

-- put
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=put&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Action/put.webp',
 'đặt', 'put');
SET @v_put := LAST_INSERT_ID();

-- show
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=show&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Action/show.webp',
 'cho xem', 'show');
SET @v_show := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Action với 9 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, @part_action, @v_clean),
(NOW(), 1, 0, NOW(), 1, 2, @part_action, @v_close),
(NOW(), 1, 0, NOW(), 1, 3, @part_action, @v_give),
(NOW(), 1, 0, NOW(), 1, 4, @part_action, @v_look_at),
(NOW(), 1, 0, NOW(), 1, 5, @part_action, @v_open),
(NOW(), 1, 0, NOW(), 1, 6, @part_action, @v_pick_up),
(NOW(), 1, 0, NOW(), 1, 7, @part_action, @v_point_to),
(NOW(), 1, 0, NOW(), 1, 8, @part_action, @v_put),
(NOW(), 1, 0, NOW(), 1, 9, @part_action, @v_show);

-- ------------------------------------------------------------
-- 5. SESSIONS (4 vòng, payload NULL)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard action vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Action', @part_action);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word action vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Action', @part_action);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking action vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Action', @part_action);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order action vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Action', @part_action);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================