-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Clothes (tạo mới)
-- 1 part duy nhất: Clothes
-- 12 vocab + session 1..5
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
-- 1. TOPIC: Clothes (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Clothes', 13,
 'https://example.com/placeholder-clothes-thumbnail.webp',
 'Clothes', @level_pre_a1);

SET @topic_clothes := LAST_INSERT_ID();

SELECT @topic_clothes AS topic_clothes_id;

-- ------------------------------------------------------------
-- 2. PART: Clothes
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Clothes', @topic_clothes);

SET @part_clothes := LAST_INSERT_ID();

SELECT @part_clothes AS part_clothes_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (12 từ)
-- ------------------------------------------------------------

-- boots
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=boots&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/boots.webp',
 'đôi bốt', 'boots');
SET @v_boots := LAST_INSERT_ID();

-- cap
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=cap&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/cap.webp',
 'mũ lưỡi trai', 'cap');
SET @v_cap := LAST_INSERT_ID();

-- dress
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=dress&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/dress.webp',
 'đầm', 'dress');
SET @v_dress := LAST_INSERT_ID();

-- hat
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=hat&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/hat.webp',
 'cái mũ', 'hat');
SET @v_hat := LAST_INSERT_ID();

-- jacket
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=jacket&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/jacket.webp',
 'áo khoác', 'jacket');
SET @v_jacket := LAST_INSERT_ID();

-- jeans
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=jeans&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/jeans.webp',
 'quần jeans', 'jeans');
SET @v_jeans := LAST_INSERT_ID();

-- shirt
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=shirt&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/shirt.webp',
 'áo sơ mi', 'shirt');
SET @v_shirt := LAST_INSERT_ID();

-- shoes
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=shoes&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/shoes.webp',
 'đôi giày', 'shoes');
SET @v_shoes := LAST_INSERT_ID();

-- shorts
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=shorts&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/shorts.webp',
 'quần đùi', 'shorts');
SET @v_shorts := LAST_INSERT_ID();

-- skirt
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=skirt&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/skirt.webp',
 'chân váy', 'skirt');
SET @v_skirt := LAST_INSERT_ID();

-- trousers
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=trousers&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/trousers.webp',
 'quần dài', 'trousers');
SET @v_trousers := LAST_INSERT_ID();

-- T-shirt
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=T-shirt&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/T-shirt.webp',
 'áo thun', 'T-shirt');
SET @v_tshirt := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Clothes với 12 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_clothes, @v_boots),
(NOW(), 1, 0, NOW(), 1, 2,  @part_clothes, @v_cap),
(NOW(), 1, 0, NOW(), 1, 3,  @part_clothes, @v_dress),
(NOW(), 1, 0, NOW(), 1, 4,  @part_clothes, @v_hat),
(NOW(), 1, 0, NOW(), 1, 5,  @part_clothes, @v_jacket),
(NOW(), 1, 0, NOW(), 1, 6,  @part_clothes, @v_jeans),
(NOW(), 1, 0, NOW(), 1, 7,  @part_clothes, @v_shirt),
(NOW(), 1, 0, NOW(), 1, 8,  @part_clothes, @v_shoes),
(NOW(), 1, 0, NOW(), 1, 9,  @part_clothes, @v_shorts),
(NOW(), 1, 0, NOW(), 1, 10, @part_clothes, @v_skirt),
(NOW(), 1, 0, NOW(), 1, 11, @part_clothes, @v_trousers),
(NOW(), 1, 0, NOW(), 1, 12, @part_clothes, @v_tshirt);

-- ------------------------------------------------------------
-- 5. SESSIONS (5 vòng)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard clothes vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Clothes', @part_clothes);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word clothes vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Clothes', @part_clothes);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking clothes vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Clothes', @part_clothes);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order clothes vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Clothes', @part_clothes);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop clothes vocabulary', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Clothes/drag_drop_clothes.webp',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=boots&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','hat',     'x',0.2255,'y',0.0795,'width',0.1388,'height',0.08),
    JSON_OBJECT('word','shoes',   'x',0.3717,'y',0.9124,'width',0.1388,'height',0.08),
    JSON_OBJECT('word','boots',   'x',0.5192,'y',0.7702,'width',0.1388,'height',0.08),
    JSON_OBJECT('word','dress',   'x',0.6942,'y',0.5348,'width',0.1388,'height',0.08),
    JSON_OBJECT('word','T-shirt', 'x',0.5592,'y',0.3993,'width',0.1388,'height',0.08),
    JSON_OBJECT('word','cap',     'x',0.3767,'y',0.1883,'width',0.1388,'height',0.08)
  )
),
 'Drag Drop: Clothes', @part_clothes);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================