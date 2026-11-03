-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Toys (tạo mới)
-- Part 1: Toys 1 (part duy nhất)
-- 9 vocab + session 1..5
--   FLASHCARD, MATCH_WORD, SPEAKING, RE_ORDER, DRAG_DROP
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
-- 1. TOPIC: Toys (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Toys', 8,
 'https://example.com/placeholder-toys-thumbnail.webp',
 'Toys', @level_pre_a1);

SET @topic_toys := LAST_INSERT_ID();

SELECT @topic_toys AS topic_toys_id;

-- ------------------------------------------------------------
-- 2. PART: Toys 1
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Toys 1', @topic_toys);

SET @part_toys_1 := LAST_INSERT_ID();

SELECT @part_toys_1 AS part_toys_1_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (9 từ)
-- ------------------------------------------------------------

-- toy
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=toy&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/toy.webp',
 'đồ chơi', 'toy');
SET @v_toy := LAST_INSERT_ID();

-- plane
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=plane&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/plane.webp',
 'máy bay', 'plane');
SET @v_plane := LAST_INSERT_ID();

-- kite
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=kite&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/kite.webp',
 'cái diều', 'kite');
SET @v_kite := LAST_INSERT_ID();

-- doll
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=doll&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/doll.webp',
 'búp bê', 'doll');
SET @v_doll := LAST_INSERT_ID();

-- robot
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=robot&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/robot.webp',
 'người máy', 'robot');
SET @v_robot := LAST_INSERT_ID();

-- ball
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=ball&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/ball.webp',
 'quả bóng', 'ball');
SET @v_ball := LAST_INSERT_ID();

-- house
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=house&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/house.webp',
 'ngôi nhà', 'house');
SET @v_house := LAST_INSERT_ID();

-- car
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=car&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/car.webp',
 'xe ô tô', 'car');
SET @v_car := LAST_INSERT_ID();

-- favourite
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=favourite&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/favourite.webp',
 'yêu thích', 'favourite');
SET @v_favourite := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Toys 1 với 9 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, @part_toys_1, @v_toy),
(NOW(), 1, 0, NOW(), 1, 2, @part_toys_1, @v_plane),
(NOW(), 1, 0, NOW(), 1, 3, @part_toys_1, @v_kite),
(NOW(), 1, 0, NOW(), 1, 4, @part_toys_1, @v_doll),
(NOW(), 1, 0, NOW(), 1, 5, @part_toys_1, @v_robot),
(NOW(), 1, 0, NOW(), 1, 6, @part_toys_1, @v_ball),
(NOW(), 1, 0, NOW(), 1, 7, @part_toys_1, @v_house),
(NOW(), 1, 0, NOW(), 1, 8, @part_toys_1, @v_car),
(NOW(), 1, 0, NOW(), 1, 9, @part_toys_1, @v_favourite);

-- ------------------------------------------------------------
-- 5. SESSIONS (5 vòng)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard toys vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Toys', @part_toys_1);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word toys vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Toys', @part_toys_1);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking toys vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Toys', @part_toys_1);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order toys vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Toys', @part_toys_1);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop toys vocabulary', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Toys/drag_drop_toys_part1.webp',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=toy&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','orange', 'x',0,     'y',0.3559,'width',0.0975,'height',0.0619),
    JSON_OBJECT('word','red',    'x',0.1681,'y',0.3352,'width',0.0975,'height',0.0619),
    JSON_OBJECT('word','green',  'x',0.5617,'y',0.3127,'width',0.0975,'height',0.0619),
    JSON_OBJECT('word','purple', 'x',0.643, 'y',0.5209,'width',0.0975,'height',0.0619),
    JSON_OBJECT('word','brown',  'x',0.6018,'y',0.6989,'width',0.0975,'height',0.0619),
    JSON_OBJECT('word','blue',   'x',0.7155,'y',0.7364,'width',0.0975,'height',0.0619)
  )
),
 'Drag Drop: Toys', @part_toys_1);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================