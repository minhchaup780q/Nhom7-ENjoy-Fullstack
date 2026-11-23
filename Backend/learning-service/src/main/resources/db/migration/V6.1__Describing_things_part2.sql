-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Describing things (đã tồn tại)
-- PART 2: Describing things 2 (order_index = 2)
-- 13 vocab + session 1..5
--   FLASHCARD, MATCH_WORD, SPEAKING, RE_ORDER, DRAG_DROP
-- Chạy chung session với file part 1 (topic + part 1 đã có)
-- Áp dụng AUTO_INCREMENT + LAST_INSERT_ID(), không gán ID cố định
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 0. LẤY LẠI topic_id CỦA DESCRIBING THINGS (topic đã tồn tại)
-- ------------------------------------------------------------
SET @topic_describing := (
  SELECT id FROM topics WHERE title = 'Describing things' LIMIT 1
);

SELECT @topic_describing AS topic_describing_id;

-- ------------------------------------------------------------
-- 1. TẠO PART 2: Describing things 2
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 2, 'Describing things 2', @topic_describing);

SET @part_describing_2 := LAST_INSERT_ID();

SELECT @part_describing_2 AS part_describing_2_id;

-- ------------------------------------------------------------
-- 2. VOCABULARIES (13 từ — tạo mới hoàn toàn)
-- ------------------------------------------------------------

-- funny
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=funny&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/funny.webp',
 'buồn cười', 'funny');
SET @v_funny := LAST_INSERT_ID();

-- angry
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=angry&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/angry.webp',
 'tức giận', 'angry');
SET @v_angry := LAST_INSERT_ID();

-- beautiful
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=beautiful&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/beautiful.webp',
 'đẹp', 'beautiful');
SET @v_beautiful := LAST_INSERT_ID();

-- ugly
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=ugly&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/ugly.webp',
 'xấu', 'ugly');
SET @v_ugly := LAST_INSERT_ID();

-- happy
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=happy&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/happy.webp',
 'hạnh phúc', 'happy');
SET @v_happy := LAST_INSERT_ID();

-- sad
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=sad&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/sad.webp',
 'buồn', 'sad');
SET @v_sad := LAST_INSERT_ID();

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

-- ------------------------------------------------------------
-- 3. PART_VOCABULARIES (nối part Describing things 2 với 13 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_describing_2, @v_funny),
(NOW(), 1, 0, NOW(), 1, 2,  @part_describing_2, @v_angry),
(NOW(), 1, 0, NOW(), 1, 3,  @part_describing_2, @v_beautiful),
(NOW(), 1, 0, NOW(), 1, 4,  @part_describing_2, @v_ugly),
(NOW(), 1, 0, NOW(), 1, 5,  @part_describing_2, @v_happy),
(NOW(), 1, 0, NOW(), 1, 6,  @part_describing_2, @v_sad),
(NOW(), 1, 0, NOW(), 1, 7,  @part_describing_2, @v_nice),
(NOW(), 1, 0, NOW(), 1, 8,  @part_describing_2, @v_big),
(NOW(), 1, 0, NOW(), 1, 9,  @part_describing_2, @v_small),
(NOW(), 1, 0, NOW(), 1, 10, @part_describing_2, @v_old),
(NOW(), 1, 0, NOW(), 1, 11, @part_describing_2, @v_young),
(NOW(), 1, 0, NOW(), 1, 12, @part_describing_2, @v_long),
(NOW(), 1, 0, NOW(), 1, 13, @part_describing_2, @v_short);

-- ------------------------------------------------------------
-- 4. SESSIONS (5 vòng)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard describing things vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Describing things 2', @part_describing_2);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word describing things vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Describing things 2', @part_describing_2);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking describing things vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Describing things 2', @part_describing_2);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order describing things vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Describing things 2', @part_describing_2);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop describing things vocabulary', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/DescribingThings/drag_drop_describingthings_part2.webp',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=funny&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','ugly',      'x',0.0255,'y',0.2396,'width',0.115,'height',0.0619),
    JSON_OBJECT('word','small',     'x',0.7342,'y',0.1589,'width',0.115,'height',0.0619),
    JSON_OBJECT('word','beautiful', 'x',0.603, 'y',0.7196,'width',0.115,'height',0.0619),
    JSON_OBJECT('word','sad',       'x',0.8642,'y',0.4889,'width',0.115,'height',0.0619),
    JSON_OBJECT('word','grey',      'x',0.0505,'y',0.7421,'width',0.115,'height',0.0619),
    JSON_OBJECT('word','angry',     'x',0.2018,'y',0.4271,'width',0.115,'height',0.0619)
  )
),
 'Drag Drop: Describing things 2', @part_describing_2);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================