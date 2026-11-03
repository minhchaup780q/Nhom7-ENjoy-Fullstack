-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Describing things (tạo mới)
-- Part: Describing things 1 (part duy nhất)
-- 17 vocab + session 1..5
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
-- 1. TOPIC: Describing things (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Describing things and animals', 6,
 'https://example.com/placeholder-describing-things-thumbnail.webp',
 'Describing things', @level_pre_a1);

SET @topic_describing := LAST_INSERT_ID();

SELECT @topic_describing AS topic_describing_id;

-- ------------------------------------------------------------
-- 2. PART: Describing things 1
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Describing things 1', @topic_describing);

SET @part_describing_1 := LAST_INSERT_ID();

SELECT @part_describing_1 AS part_describing_1_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (17 từ)
-- ------------------------------------------------------------

-- young
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=young&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/young.webp',
 'trẻ', 'young');
SET @v_young := LAST_INSERT_ID();

-- old
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=old&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/old.webp',
 'già', 'old');
SET @v_old := LAST_INSERT_ID();

-- long
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=long&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/long.webp',
 'dài', 'long');
SET @v_long := LAST_INSERT_ID();

-- short
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=short&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/short.webp',
 'ngắn', 'short');
SET @v_short := LAST_INSERT_ID();

-- small
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=small&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/small.webp',
 'nhỏ', 'small');
SET @v_small := LAST_INSERT_ID();

-- big
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=big&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/big.webp',
 'to', 'big');
SET @v_big := LAST_INSERT_ID();

-- nice
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=nice&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/nice.webp',
 'tốt', 'nice');
SET @v_nice := LAST_INSERT_ID();

-- duck
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=duck&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/duck.webp',
 'con vịt', 'duck');
SET @v_duck := LAST_INSERT_ID();

-- dog
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=dog&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/dog.webp',
 'con chó', 'dog');
SET @v_dog := LAST_INSERT_ID();

-- chicken
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=chicken&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/chicken.webp',
 'con gà', 'chicken');
SET @v_chicken := LAST_INSERT_ID();

-- cat
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=cat&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/cat.webp',
 'con mèo', 'cat');
SET @v_cat := LAST_INSERT_ID();

-- sheep
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=sheep&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/sheep.webp',
 'con cừu', 'sheep');
SET @v_sheep := LAST_INSERT_ID();

-- goat
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=goat&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/goat.webp',
 'con dê', 'goat');
SET @v_goat := LAST_INSERT_ID();

-- spider
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=spider&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/spider.webp',
 'con nhện', 'spider');
SET @v_spider := LAST_INSERT_ID();

-- horse
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=horse&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/horse.webp',
 'con ngựa', 'horse');
SET @v_horse := LAST_INSERT_ID();

-- cow
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=cow&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/cow.webp',
 'con bò', 'cow');
SET @v_cow := LAST_INSERT_ID();

-- donkey
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=donkey&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/donkey.webp',
 'con lừa', 'donkey');
SET @v_donkey := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Describing things 1 với 17 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_describing_1, @v_young),
(NOW(), 1, 0, NOW(), 1, 2,  @part_describing_1, @v_old),
(NOW(), 1, 0, NOW(), 1, 3,  @part_describing_1, @v_long),
(NOW(), 1, 0, NOW(), 1, 4,  @part_describing_1, @v_short),
(NOW(), 1, 0, NOW(), 1, 5,  @part_describing_1, @v_small),
(NOW(), 1, 0, NOW(), 1, 6,  @part_describing_1, @v_big),
(NOW(), 1, 0, NOW(), 1, 7,  @part_describing_1, @v_nice),
(NOW(), 1, 0, NOW(), 1, 8,  @part_describing_1, @v_duck),
(NOW(), 1, 0, NOW(), 1, 9,  @part_describing_1, @v_dog),
(NOW(), 1, 0, NOW(), 1, 10, @part_describing_1, @v_chicken),
(NOW(), 1, 0, NOW(), 1, 11, @part_describing_1, @v_cat),
(NOW(), 1, 0, NOW(), 1, 12, @part_describing_1, @v_sheep),
(NOW(), 1, 0, NOW(), 1, 13, @part_describing_1, @v_goat),
(NOW(), 1, 0, NOW(), 1, 14, @part_describing_1, @v_spider),
(NOW(), 1, 0, NOW(), 1, 15, @part_describing_1, @v_horse),
(NOW(), 1, 0, NOW(), 1, 16, @part_describing_1, @v_cow),
(NOW(), 1, 0, NOW(), 1, 17, @part_describing_1, @v_donkey);

-- ------------------------------------------------------------
-- 5. SESSIONS (5 vòng)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard describing things vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Describing things', @part_describing_1);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word describing things vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Describing things', @part_describing_1);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking describing things vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Describing things', @part_describing_1);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order describing things vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Describing things', @part_describing_1);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop describing things vocabulary', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/drag_drop_describingthings.webp',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=young&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','Leo',   'x',0,      'y',0.3111,'width',0.1313,'height',0.0788),
    JSON_OBJECT('word','Nina',  'x',0.333,  'y',0.4312,'width',0.1313,'height',0.0788),
    JSON_OBJECT('word','Max',   'x',0.7841, 'y',0.329, 'width',0.1313,'height',0.0788),
    JSON_OBJECT('word','Rin',   'x',0.753,  'y',0.7841,'width',0.1313,'height',0.0788),
    JSON_OBJECT('word','Molly', 'x',0.468,  'y',0.7353,'width',0.1313,'height',0.0788),
    JSON_OBJECT('word','Bam',   'x',0.0417, 'y',0.724, 'width',0.1313,'height',0.0788)
  )
),
 'Drag Drop: Describing things', @part_describing_1);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================