-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Color (Colors for kids)
-- File thứ 2 — nối tiếp file seed_01_number.sql
-- Áp dụng AUTO_INCREMENT + LAST_INSERT_ID()
-- Ảnh: /session-items/Color/<word>.webp trên S3
-- Audio: dict.youdao.com theo từng word
--
-- Sessions (chỉ 5 vòng đầu, KHÔNG có Grammar trở đi):
--   Vòng 1: FLASHCARD
--   Vòng 2: MATCH_WORD
--   Vòng 3: SPEAKING
--   Vòng 4: RE_ORDER
--   Vòng 5: DRAG_DROP
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 1. TOPIC: Color
--    Level đã có sẵn từ file 1 (Pre A1)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Colors for kids', 2,
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/color.webp',
 'Color', 1);

SET @topic_color := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 2. PART: Colors
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Colors', @topic_color);

SET @part_color := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 3. VOCABULARIES (11 màu)
-- ------------------------------------------------------------

-- blue
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=blue&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/blue.webp',
 'màu xanh dương', 'blue');
SET @v_blue := LAST_INSERT_ID();

-- green
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=green&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/green.webp',
 'màu xanh lá', 'green');
SET @v_green := LAST_INSERT_ID();

-- pink
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=pink&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/pink.webp',
 'màu hồng', 'pink');
SET @v_pink := LAST_INSERT_ID();

-- red
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=red&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/red.webp',
 'màu đỏ', 'red');
SET @v_red := LAST_INSERT_ID();

-- purple
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=purple&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/purple.webp',
 'màu tím', 'purple');
SET @v_purple := LAST_INSERT_ID();

-- yellow
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=yellow&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/yellow.webp',
 'màu vàng', 'yellow');
SET @v_yellow := LAST_INSERT_ID();

-- orange
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=orange&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/orange.webp',
 'màu cam', 'orange');
SET @v_orange := LAST_INSERT_ID();

-- white
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=white&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/white.webp',
 'màu trắng', 'white');
SET @v_white := LAST_INSERT_ID();

-- black
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=black&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/black.webp',
 'màu đen', 'black');
SET @v_black := LAST_INSERT_ID();

-- brown
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=brown&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/brown.webp',
 'màu nâu', 'brown');
SET @v_brown := LAST_INSERT_ID();

-- grey
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=grey&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/grey.webp',
 'màu xám', 'grey');
SET @v_grey := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_color, @v_blue),
(NOW(), 1, 0, NOW(), 1, 2,  @part_color, @v_green),
(NOW(), 1, 0, NOW(), 1, 3,  @part_color, @v_pink),
(NOW(), 1, 0, NOW(), 1, 4,  @part_color, @v_red),
(NOW(), 1, 0, NOW(), 1, 5,  @part_color, @v_purple),
(NOW(), 1, 0, NOW(), 1, 6,  @part_color, @v_yellow),
(NOW(), 1, 0, NOW(), 1, 7,  @part_color, @v_orange),
(NOW(), 1, 0, NOW(), 1, 8,  @part_color, @v_white),
(NOW(), 1, 0, NOW(), 1, 9,  @part_color, @v_black),
(NOW(), 1, 0, NOW(), 1, 10, @part_color, @v_brown),
(NOW(), 1, 0, NOW(), 1, 11, @part_color, @v_grey);

-- ------------------------------------------------------------
-- 5. SESSIONS (5 vòng đầu, cấu trúc giống topic Number)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard colors', 'FLASHCARD', 1, NULL,
 'Flashcard: Colors', @part_color);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word colors', 'MATCH_WORD', 2, NULL,
 'Match Word: Colors', @part_color);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking colors', 'SPEAKING', 3, NULL,
 'Speaking: Colors', @part_color);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order colors', 'RE_ORDER', 4, NULL,
 'Re-order: Colors', @part_color);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop colors', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Color/color.jpg',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=blue&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','blue',   'x',0.1000,'y',0.1000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','green',  'x',0.2500,'y',0.1000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','pink',   'x',0.4000,'y',0.1000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','red',    'x',0.5500,'y',0.1000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','purple', 'x',0.7000,'y',0.1000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','yellow', 'x',0.1000,'y',0.3000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','orange', 'x',0.2500,'y',0.3000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','white',  'x',0.4000,'y',0.3000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','black',  'x',0.5500,'y',0.3000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','brown',  'x',0.7000,'y',0.3000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','grey',   'x',0.4000,'y',0.5000,'width',0.0800,'height',0.0400)
  )
),
 'Drag Drop: Colors', @part_color);

-- ============================================================
-- 6. KHÔNG reset AUTO_INCREMENT
-- ============================================================