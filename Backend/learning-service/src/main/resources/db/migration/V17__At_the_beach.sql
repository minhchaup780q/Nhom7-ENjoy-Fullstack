-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: At the beach (tạo mới)
-- 1 part duy nhất: At the beach
-- 13 vocab + session 1..4
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
-- 1. TOPIC: At the beach (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'At the beach', 17,
 'https://example.com/placeholder-at-the-beach-thumbnail.webp',
 'At the beach', @level_pre_a1);

SET @topic_at_the_beach := LAST_INSERT_ID();

SELECT @topic_at_the_beach AS topic_at_the_beach_id;

-- ------------------------------------------------------------
-- 2. PART: At the beach
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'At the beach', @topic_at_the_beach);

SET @part_at_the_beach := LAST_INSERT_ID();

SELECT @part_at_the_beach AS part_at_the_beach_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (13 từ)
-- ------------------------------------------------------------

-- at the beach
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=at+the+beach&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/at_the_beach.webp',
 'ở bãi biển', 'at the beach');
SET @v_at_the_beach := LAST_INSERT_ID();

-- beach
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=beach&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/beach.webp',
 'bãi biển', 'beach');
SET @v_beach := LAST_INSERT_ID();

-- boat
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=boat&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/boat.webp',
 'con thuyền', 'boat');
SET @v_boat := LAST_INSERT_ID();

-- fish
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=fish&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/fish.webp',
 'con cá', 'fish');
SET @v_fish := LAST_INSERT_ID();

-- in a boat
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=in+a+boat&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/in_a_boat.webp',
 'ở trên thuyền', 'in a boat');
SET @v_in_a_boat := LAST_INSERT_ID();

-- in the sea
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=in+the+sea&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/in_the_sea.webp',
 'ở dưới biển', 'in the sea');
SET @v_in_the_sea := LAST_INSERT_ID();

-- in the sun
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=in+the+sun&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/in_the_sun.webp',
 'dưới ánh nắng', 'in the sun');
SET @v_in_the_sun := LAST_INSERT_ID();

-- jellyfish
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=jellyfish&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/jellyfish.webp',
 'con sứa', 'jellyfish');
SET @v_jellyfish := LAST_INSERT_ID();

-- on the sand
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=on+the+sand&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/on_the_sand.webp',
 'trên mặt cát', 'on the sand');
SET @v_on_the_sand := LAST_INSERT_ID();

-- sand
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=sand&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/sand.webp',
 'cát', 'sand');
SET @v_sand := LAST_INSERT_ID();

-- sea
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=sea&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/sea.webp',
 'biển', 'sea');
SET @v_sea := LAST_INSERT_ID();

-- shell
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=shell&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/shell.webp',
 'vỏ sò', 'shell');
SET @v_shell := LAST_INSERT_ID();

-- sun
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=sun&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/AtTheBeach/sun.webp',
 'mặt trời', 'sun');
SET @v_sun := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part At the beach với 13 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_at_the_beach, @v_at_the_beach),
(NOW(), 1, 0, NOW(), 1, 2,  @part_at_the_beach, @v_beach),
(NOW(), 1, 0, NOW(), 1, 3,  @part_at_the_beach, @v_boat),
(NOW(), 1, 0, NOW(), 1, 4,  @part_at_the_beach, @v_fish),
(NOW(), 1, 0, NOW(), 1, 5,  @part_at_the_beach, @v_in_a_boat),
(NOW(), 1, 0, NOW(), 1, 6,  @part_at_the_beach, @v_in_the_sea),
(NOW(), 1, 0, NOW(), 1, 7,  @part_at_the_beach, @v_in_the_sun),
(NOW(), 1, 0, NOW(), 1, 8,  @part_at_the_beach, @v_jellyfish),
(NOW(), 1, 0, NOW(), 1, 9,  @part_at_the_beach, @v_on_the_sand),
(NOW(), 1, 0, NOW(), 1, 10, @part_at_the_beach, @v_sand),
(NOW(), 1, 0, NOW(), 1, 11, @part_at_the_beach, @v_sea),
(NOW(), 1, 0, NOW(), 1, 12, @part_at_the_beach, @v_shell),
(NOW(), 1, 0, NOW(), 1, 13, @part_at_the_beach, @v_sun);

-- ------------------------------------------------------------
-- 5. SESSIONS (4 vòng, payload NULL)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard at the beach vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: At the beach', @part_at_the_beach);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word at the beach vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: At the beach', @part_at_the_beach);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking at the beach vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: At the beach', @part_at_the_beach);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order at the beach vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: At the beach', @part_at_the_beach);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================