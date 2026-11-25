-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Things in the house (tạo mới)
-- 1 part duy nhất: Things in the house
-- 12 vocab + session 1..4
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
-- 1. TOPIC: Things in the house (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Things in the house', 12,
 'https://example.com/placeholder-things-in-the-house-thumbnail.webp',
 'Things in the house', @level_pre_a1);

SET @topic_things_house := LAST_INSERT_ID();

SELECT @topic_things_house AS topic_things_house_id;

-- ------------------------------------------------------------
-- 2. PART: Things in the house
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Things in the house', @topic_things_house);

SET @part_things_house := LAST_INSERT_ID();

SELECT @part_things_house AS part_things_house_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (12 từ)
-- ------------------------------------------------------------

-- armchair
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=armchair&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/armchair.webp',
 'ghế bành', 'armchair');
SET @v_armchair := LAST_INSERT_ID();

-- bed
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=bed&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/bed.webp',
 'cái giường', 'bed');
SET @v_bed := LAST_INSERT_ID();

-- clock
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=clock&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/clock.webp',
 'đồng hồ', 'clock');
SET @v_clock := LAST_INSERT_ID();

-- floor
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=floor&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/floor.webp',
 'sàn nhà', 'floor');
SET @v_floor := LAST_INSERT_ID();

-- hat
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=hat&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/hat.webp',
 'cái mũ', 'hat');
SET @v_hat := LAST_INSERT_ID();

-- lamp
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=lamp&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/lamp.webp',
 'đèn ngủ', 'lamp');
SET @v_lamp := LAST_INSERT_ID();

-- mirror
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=mirror&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/mirror.webp',
 'cái gương', 'mirror');
SET @v_mirror := LAST_INSERT_ID();

-- painting
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=painting&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/painting.webp',
 'bức tranh', 'painting');
SET @v_painting := LAST_INSERT_ID();

-- phone
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=phone&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/phone.webp',
 'điện thoại', 'phone');
SET @v_phone := LAST_INSERT_ID();

-- radio
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=radio&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/radio.webp',
 'cái đài', 'radio');
SET @v_radio := LAST_INSERT_ID();

-- rug
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=rug&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/rug.webp',
 'thảm trải sàn', 'rug');
SET @v_rug := LAST_INSERT_ID();

-- sofa
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=sofa&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ThingsInTheHouse/sofa.webp',
 'ghế sofa', 'sofa');
SET @v_sofa := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Things in the house với 12 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_things_house, @v_armchair),
(NOW(), 1, 0, NOW(), 1, 2,  @part_things_house, @v_bed),
(NOW(), 1, 0, NOW(), 1, 3,  @part_things_house, @v_clock),
(NOW(), 1, 0, NOW(), 1, 4,  @part_things_house, @v_floor),
(NOW(), 1, 0, NOW(), 1, 5,  @part_things_house, @v_hat),
(NOW(), 1, 0, NOW(), 1, 6,  @part_things_house, @v_lamp),
(NOW(), 1, 0, NOW(), 1, 7,  @part_things_house, @v_mirror),
(NOW(), 1, 0, NOW(), 1, 8,  @part_things_house, @v_painting),
(NOW(), 1, 0, NOW(), 1, 9,  @part_things_house, @v_phone),
(NOW(), 1, 0, NOW(), 1, 10, @part_things_house, @v_radio),
(NOW(), 1, 0, NOW(), 1, 11, @part_things_house, @v_rug),
(NOW(), 1, 0, NOW(), 1, 12, @part_things_house, @v_sofa);

-- ------------------------------------------------------------
-- 5. SESSIONS (4 vòng, payload NULL)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard things in the house vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Things in the house', @part_things_house);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word things in the house vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Things in the house', @part_things_house);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking things in the house vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Things in the house', @part_things_house);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order things in the house vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Things in the house', @part_things_house);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================