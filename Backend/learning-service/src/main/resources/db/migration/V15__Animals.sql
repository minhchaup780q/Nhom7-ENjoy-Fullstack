-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Animal (tạo mới)
-- 1 part duy nhất: Animal
-- 11 vocab + session 1..4
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
-- 1. TOPIC: Animal (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Animals', 10,
 'https://example.com/placeholder-animal-thumbnail.webp',
 'Animal', @level_pre_a1);

SET @topic_animal := LAST_INSERT_ID();

SELECT @topic_animal AS topic_animal_id;

-- ------------------------------------------------------------
-- 2. PART: Animal
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Animal', @topic_animal);

SET @part_animal := LAST_INSERT_ID();

SELECT @part_animal AS part_animal_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (11 từ)
-- ------------------------------------------------------------

-- animals
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=animals&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Animal/animals.webp',
 'động vật', 'animals');
SET @v_animals := LAST_INSERT_ID();

-- zebra
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=zebra&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Animal/zebra.webp',
 'ngựa vằn', 'zebra');
SET @v_zebra := LAST_INSERT_ID();

-- hippo
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=hippo&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Animal/hippo.webp',
 'hà mã', 'hippo');
SET @v_hippo := LAST_INSERT_ID();

-- giraffe
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=giraffe&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Animal/giraffe.webp',
 'hươu cao cổ', 'giraffe');
SET @v_giraffe := LAST_INSERT_ID();

-- bear
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=bear&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Animal/bear.webp',
 'con gấu', 'bear');
SET @v_bear := LAST_INSERT_ID();

-- polar bear
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=polar+bear&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Animal/polar_bear.webp',
 'gấu Bắc Cực', 'polar bear');
SET @v_polar_bear := LAST_INSERT_ID();

-- crocodile
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=crocodile&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Animal/crocodile.webp',
 'cá sấu', 'crocodile');
SET @v_crocodile := LAST_INSERT_ID();

-- lizard
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=lizard&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Animal/lizard.webp',
 'thằn lằn', 'lizard');
SET @v_lizard := LAST_INSERT_ID();

-- monkey
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=monkey&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Animal/monkey.webp',
 'con khỉ', 'monkey');
SET @v_monkey := LAST_INSERT_ID();

-- snake
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=snake&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Animal/snake.webp',
 'con rắn', 'snake');
SET @v_snake := LAST_INSERT_ID();

-- tiger
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=tiger&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Animal/tiger.webp',
 'con hổ', 'tiger');
SET @v_tiger := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Animal với 11 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_animal, @v_animals),
(NOW(), 1, 0, NOW(), 1, 2,  @part_animal, @v_zebra),
(NOW(), 1, 0, NOW(), 1, 3,  @part_animal, @v_hippo),
(NOW(), 1, 0, NOW(), 1, 4,  @part_animal, @v_giraffe),
(NOW(), 1, 0, NOW(), 1, 5,  @part_animal, @v_bear),
(NOW(), 1, 0, NOW(), 1, 6,  @part_animal, @v_polar_bear),
(NOW(), 1, 0, NOW(), 1, 7,  @part_animal, @v_crocodile),
(NOW(), 1, 0, NOW(), 1, 8,  @part_animal, @v_lizard),
(NOW(), 1, 0, NOW(), 1, 9,  @part_animal, @v_monkey),
(NOW(), 1, 0, NOW(), 1, 10, @part_animal, @v_snake),
(NOW(), 1, 0, NOW(), 1, 11, @part_animal, @v_tiger);

-- ------------------------------------------------------------
-- 5. SESSIONS (4 vòng, payload NULL)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard animal vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Animal', @part_animal);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word animal vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Animal', @part_animal);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking animal vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Animal', @part_animal);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order animal vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Animal', @part_animal);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================