-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: A day out (tạo mới)
-- 1 part duy nhất: A day out
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

SELECT @level_pre_a1 AS level_pre_a1_id;

-- ------------------------------------------------------------
-- 1. TOPIC: A day out (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'A day out', 9,
 'https://example.com/placeholder-a-day-out-thumbnail.webp',
 'A day out', @level_pre_a1);

SET @topic_a_day_out := LAST_INSERT_ID();

SELECT @topic_a_day_out AS topic_a_day_out_id;

-- ------------------------------------------------------------
-- 2. PART: A day out
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'A day out', @topic_a_day_out);

SET @part_a_day_out := LAST_INSERT_ID();

SELECT @part_a_day_out AS part_a_day_out_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (11 từ)
-- ------------------------------------------------------------

-- tree
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=tree&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/tree.webp',
 'cái cây', 'tree');
SET @v_tree := LAST_INSERT_ID();

-- park
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=park&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/park.webp',
 'công viên', 'park');
SET @v_park := LAST_INSERT_ID();

-- garden
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=garden&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/garden.webp',
 'khu vườn', 'garden');
SET @v_garden := LAST_INSERT_ID();

-- flower
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=flower&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/flower.webp',
 'bông hoa', 'flower');
SET @v_flower := LAST_INSERT_ID();

-- train
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=train&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/train.webp',
 'tàu hỏa', 'train');
SET @v_train := LAST_INSERT_ID();

-- bus
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=bus&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/bus.webp',
 'xe buýt', 'bus');
SET @v_bus := LAST_INSERT_ID();

-- bus stop
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=bus+stop&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/bus_stop.webp',
 'trạm xe buýt', 'bus stop');
SET @v_bus_stop := LAST_INSERT_ID();

-- motorbike
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=motorbike&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/motorbike.webp',
 'xe máy', 'motorbike');
SET @v_motorbike := LAST_INSERT_ID();

-- lorry
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=lorry&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/lorry.webp',
 'xe tải', 'lorry');
SET @v_lorry := LAST_INSERT_ID();

-- shop
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=shop&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/shop.webp',
 'cửa hàng', 'shop');
SET @v_shop := LAST_INSERT_ID();

-- car
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=car&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/car.webp',
 'xe ô tô', 'car');
SET @v_car := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part A day out với 11 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_a_day_out, @v_tree),
(NOW(), 1, 0, NOW(), 1, 2,  @part_a_day_out, @v_park),
(NOW(), 1, 0, NOW(), 1, 3,  @part_a_day_out, @v_garden),
(NOW(), 1, 0, NOW(), 1, 4,  @part_a_day_out, @v_flower),
(NOW(), 1, 0, NOW(), 1, 5,  @part_a_day_out, @v_train),
(NOW(), 1, 0, NOW(), 1, 6,  @part_a_day_out, @v_bus),
(NOW(), 1, 0, NOW(), 1, 7,  @part_a_day_out, @v_bus_stop),
(NOW(), 1, 0, NOW(), 1, 8,  @part_a_day_out, @v_motorbike),
(NOW(), 1, 0, NOW(), 1, 9,  @part_a_day_out, @v_lorry),
(NOW(), 1, 0, NOW(), 1, 10, @part_a_day_out, @v_shop),
(NOW(), 1, 0, NOW(), 1, 11, @part_a_day_out, @v_car);

-- ------------------------------------------------------------
-- 5. SESSIONS (5 vòng)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard a day out vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: A day out', @part_a_day_out);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word a day out vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: A day out', @part_a_day_out);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking a day out vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: A day out', @part_a_day_out);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order a day out vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: A day out', @part_a_day_out);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop a day out vocabulary', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ADayOut/drag_drop_adayout.webp',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=tree&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','flower',   'x',0.8522,'y',0.8302,'width',0.1388,'height',0.0638),
    JSON_OBJECT('word','garden',   'x',0.8267,'y',0.5752,'width',0.1388,'height',0.0638),
    JSON_OBJECT('word','car',      'x',0.638, 'y',0.6859,'width',0.1388,'height',0.0638),
    JSON_OBJECT('word','motorbike','x',0.5941,'y',0.5209,'width',0.1388,'height',0.0638),
    JSON_OBJECT('word','bus',      'x',0.4667,'y',0.3802,'width',0.1388,'height',0.0638),
    JSON_OBJECT('word','bus stop', 'x',0.3113,'y',0.4854,'width',0.1388,'height',0.0638),
    JSON_OBJECT('word','lorry',    'x',0.1168,'y',0.4027,'width',0.1388,'height',0.0638),
    JSON_OBJECT('word','park',     'x',0.0593,'y',0.2884,'width',0.1388,'height',0.0638),
    JSON_OBJECT('word','shop',     'x',0.283, 'y',0.2527,'width',0.1388,'height',0.0638)
  )
),
 'Drag Drop: A day out', @part_a_day_out);
-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================