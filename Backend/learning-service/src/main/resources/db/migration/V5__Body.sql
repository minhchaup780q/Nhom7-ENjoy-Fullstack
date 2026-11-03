-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Body (tạo mới)
-- 1 part duy nhất: Body
-- 14 vocab + session 1..4
--   FLASHCARD, MATCH_WORD, SPEAKING, RE_ORDER (không có session 5)
-- Áp dụng AUTO_INCREMENT + LAST_INSERT_ID(), không gán ID cố định
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 0. LẤY LẠI level_id PRE_A1 (level đã tồn tại)
-- ------------------------------------------------------------
SET @level_pre_a1 := (
  SELECT id FROM levels WHERE code = 'PRE_A1' LIMIT 1
);

-- Kiểm tra: phải ra số, không NULL
SELECT @level_pre_a1 AS level_pre_a1_id;

-- ------------------------------------------------------------
-- 1. TOPIC: Body (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Body parts', 5,
 'https://example.com/placeholder-body-thumbnail.webp',
 'Body', @level_pre_a1);

SET @topic_body := LAST_INSERT_ID();

-- Kiểm tra
SELECT @topic_body AS topic_body_id;

-- ------------------------------------------------------------
-- 2. PART: Body (part duy nhất)
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Body', @topic_body);

SET @part_body := LAST_INSERT_ID();

-- Kiểm tra
SELECT @part_body AS part_body_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (14 từ)
-- ------------------------------------------------------------

-- head
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=head&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/head.webp',
 'đầu', 'head');
SET @v_head := LAST_INSERT_ID();

-- nose
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=nose&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/nose.webp',
 'mũi', 'nose');
SET @v_nose := LAST_INSERT_ID();

-- arm
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=arm&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/arm.webp',
 'cánh tay', 'arm');
SET @v_arm := LAST_INSERT_ID();

-- ear
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=ear&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/ear.webp',
 'tai', 'ear');
SET @v_ear := LAST_INSERT_ID();

-- hand
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=hand&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/hand.webp',
 'bàn tay', 'hand');
SET @v_hand := LAST_INSERT_ID();

-- foot
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=foot&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/foot.webp',
 '1 bàn chân', 'foot');
SET @v_foot := LAST_INSERT_ID();

-- feet
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=feet&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/feet.webp',
 '2 bàn chân', 'feet');
SET @v_feet := LAST_INSERT_ID();

-- body
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=body&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/body.webp',
 'cơ thể', 'body');
SET @v_body := LAST_INSERT_ID();

-- hair
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=hair&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/hair.webp',
 'tóc', 'hair');
SET @v_hair := LAST_INSERT_ID();

-- leg
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=leg&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/leg.webp',
 'chân', 'leg');
SET @v_leg := LAST_INSERT_ID();

-- eye
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=eye&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/eye.webp',
 'mắt', 'eye');
SET @v_eye := LAST_INSERT_ID();

-- mouth
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=mouth&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/mouth.webp',
 'miệng', 'mouth');
SET @v_mouth := LAST_INSERT_ID();

-- face
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=face&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/face.webp',
 'khuôn mặt', 'face');
SET @v_face := LAST_INSERT_ID();

-- tail
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=tail&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Body/tail.webp',
 'đuôi', 'tail');
SET @v_tail := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Body với 14 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_body, @v_head),
(NOW(), 1, 0, NOW(), 1, 2,  @part_body, @v_nose),
(NOW(), 1, 0, NOW(), 1, 3,  @part_body, @v_arm),
(NOW(), 1, 0, NOW(), 1, 4,  @part_body, @v_ear),
(NOW(), 1, 0, NOW(), 1, 5,  @part_body, @v_hand),
(NOW(), 1, 0, NOW(), 1, 6,  @part_body, @v_foot),
(NOW(), 1, 0, NOW(), 1, 7,  @part_body, @v_feet),
(NOW(), 1, 0, NOW(), 1, 8,  @part_body, @v_body),
(NOW(), 1, 0, NOW(), 1, 9,  @part_body, @v_hair),
(NOW(), 1, 0, NOW(), 1, 10, @part_body, @v_leg),
(NOW(), 1, 0, NOW(), 1, 11, @part_body, @v_eye),
(NOW(), 1, 0, NOW(), 1, 12, @part_body, @v_mouth),
(NOW(), 1, 0, NOW(), 1, 13, @part_body, @v_face),
(NOW(), 1, 0, NOW(), 1, 14, @part_body, @v_tail);

-- ------------------------------------------------------------
-- 5. SESSIONS (4 vòng, payload NULL)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard body vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Body', @part_body);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word body vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Body', @part_body);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking body vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Body', @part_body);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order body vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Body', @part_body);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================