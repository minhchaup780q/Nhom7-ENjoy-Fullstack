-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Family (tạo mới)
-- 1 part duy nhất: Family
-- 11 vocab + session 1..5
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

-- Kiểm tra: phải ra số, không NULL
SELECT @level_pre_a1 AS level_pre_a1_id;

-- ------------------------------------------------------------
-- 1. TOPIC: Family (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Family members', 4,
 'https://example.com/placeholder-family-thumbnail.webp',
 'Family', @level_pre_a1);

SET @topic_family := LAST_INSERT_ID();

-- Kiểm tra
SELECT @topic_family AS topic_family_id;

-- ------------------------------------------------------------
-- 2. PART: Family (part duy nhất)
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Family', @topic_family);

SET @part_family := LAST_INSERT_ID();

-- Kiểm tra
SELECT @part_family AS part_family_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (11 từ)
-- ------------------------------------------------------------

-- family
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=family&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/family.webp',
 'gia đình', 'family');
SET @v_family := LAST_INSERT_ID();

-- mother
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=mother&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/mother.webp',
 'mẹ', 'mother');
SET @v_mother := LAST_INSERT_ID();

-- mum
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=mum&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/mum.webp',
 'mẹ', 'mum');
SET @v_mum := LAST_INSERT_ID();

-- father
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=father&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/father.webp',
 'bố / cha', 'father');
SET @v_father := LAST_INSERT_ID();

-- dad
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=dad&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/dad.webp',
 'bố', 'dad');
SET @v_dad := LAST_INSERT_ID();

-- grandfather
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=grandfather&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/grandfather.webp',
 'ông', 'grandfather');
SET @v_grandfather := LAST_INSERT_ID();

-- grandpa
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=grandpa&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/grandpa.webp',
 'ông', 'grandpa');
SET @v_grandpa := LAST_INSERT_ID();

-- grandmother
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=grandmother&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/grandmother.webp',
 'bà', 'grandmother');
SET @v_grandmother := LAST_INSERT_ID();

-- grandma
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=grandma&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/grandma.webp',
 'bà', 'grandma');
SET @v_grandma := LAST_INSERT_ID();

-- sister
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=sister&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/sister.webp',
 'chị/em gái', 'sister');
SET @v_sister := LAST_INSERT_ID();

-- brother
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=brother&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/brother.webp',
 'anh/em trai', 'brother');
SET @v_brother := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Family với 11 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_family, @v_family),
(NOW(), 1, 0, NOW(), 1, 2,  @part_family, @v_mother),
(NOW(), 1, 0, NOW(), 1, 3,  @part_family, @v_mum),
(NOW(), 1, 0, NOW(), 1, 4,  @part_family, @v_father),
(NOW(), 1, 0, NOW(), 1, 5,  @part_family, @v_dad),
(NOW(), 1, 0, NOW(), 1, 6,  @part_family, @v_grandfather),
(NOW(), 1, 0, NOW(), 1, 7,  @part_family, @v_grandpa),
(NOW(), 1, 0, NOW(), 1, 8,  @part_family, @v_grandmother),
(NOW(), 1, 0, NOW(), 1, 9,  @part_family, @v_grandma),
(NOW(), 1, 0, NOW(), 1, 10, @part_family, @v_sister),
(NOW(), 1, 0, NOW(), 1, 11, @part_family, @v_brother);

-- ------------------------------------------------------------
-- 5. SESSIONS (5 vòng)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard family vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Family', @part_family);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word family vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Family', @part_family);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking family vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Family', @part_family);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order family vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Family', @part_family);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop family vocabulary', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Family/drag_drop_family.webp',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=family&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','Lucy', 'x',0.138,  'y',0.4545,'width',0.1138,'height',0.06),
    JSON_OBJECT('word','Pat',  'x',0.788,  'y',0.4282,'width',0.1138,'height',0.06),
    JSON_OBJECT('word','Liz',  'x',0.4167, 'y',0.627, 'width',0.1138,'height',0.06),
    JSON_OBJECT('word','Eric', 'x',0.273,  'y',0.6251,'width',0.1138,'height',0.06),
    JSON_OBJECT('word','Hugo', 'x',0.053,  'y',0.7751,'width',0.1138,'height',0.06)
  )
),
 'Drag Drop: Family', @part_family);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================