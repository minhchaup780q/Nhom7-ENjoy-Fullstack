-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Room (tạo mới)
-- 1 part duy nhất: Room
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
-- 1. TOPIC: Room (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Rooms and actions', 11,
 'https://example.com/placeholder-room-thumbnail.webp',
 'Room', @level_pre_a1);

SET @topic_room := LAST_INSERT_ID();

SELECT @topic_room AS topic_room_id;

-- ------------------------------------------------------------
-- 2. PART: Room
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Room', @topic_room);

SET @part_room := LAST_INSERT_ID();

SELECT @part_room AS part_room_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (12 từ)
-- ------------------------------------------------------------

-- bedroom
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=bedroom&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/bedroom.webp',
 'phòng ngủ', 'bedroom');
SET @v_bedroom := LAST_INSERT_ID();

-- living room
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=living+room&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/living_room.webp',
 'phòng khách', 'living room');
SET @v_living_room := LAST_INSERT_ID();

-- bathroom
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=bathroom&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/bathroom.webp',
 'phòng tắm', 'bathroom');
SET @v_bathroom := LAST_INSERT_ID();

-- kitchen
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=kitchen&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/kitchen.webp',
 'nhà bếp', 'kitchen');
SET @v_kitchen := LAST_INSERT_ID();

-- dining room
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=dining+room&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/dining_room.webp',
 'phòng ăn', 'dining room');
SET @v_dining_room := LAST_INSERT_ID();

-- hall
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=hall&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/hall.webp',
 'hành lang', 'hall');
SET @v_hall := LAST_INSERT_ID();

-- cook
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=cook&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/cook.webp',
 'nấu ăn', 'cook');
SET @v_cook := LAST_INSERT_ID();

-- take a bath
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=take+a+bath&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/take_a_bath.webp',
 'tắm bồn', 'take a bath');
SET @v_take_a_bath := LAST_INSERT_ID();

-- eat
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=eat&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/eat.webp',
 'ăn', 'eat');
SET @v_eat := LAST_INSERT_ID();

-- sleep
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=sleep&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/sleep.webp',
 'ngủ', 'sleep');
SET @v_sleep := LAST_INSERT_ID();

-- play
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=play&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/play.webp',
 'chơi', 'play');
SET @v_play := LAST_INSERT_ID();

-- watch TV
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=watch+TV&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/watch_TV.webp',
 'xem TV', 'watch TV');
SET @v_watch_tv := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Room với 12 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_room, @v_bedroom),
(NOW(), 1, 0, NOW(), 1, 2,  @part_room, @v_living_room),
(NOW(), 1, 0, NOW(), 1, 3,  @part_room, @v_bathroom),
(NOW(), 1, 0, NOW(), 1, 4,  @part_room, @v_kitchen),
(NOW(), 1, 0, NOW(), 1, 5,  @part_room, @v_dining_room),
(NOW(), 1, 0, NOW(), 1, 6,  @part_room, @v_hall),
(NOW(), 1, 0, NOW(), 1, 7,  @part_room, @v_cook),
(NOW(), 1, 0, NOW(), 1, 8,  @part_room, @v_take_a_bath),
(NOW(), 1, 0, NOW(), 1, 9,  @part_room, @v_eat),
(NOW(), 1, 0, NOW(), 1, 10, @part_room, @v_sleep),
(NOW(), 1, 0, NOW(), 1, 11, @part_room, @v_play),
(NOW(), 1, 0, NOW(), 1, 12, @part_room, @v_watch_tv);

-- ------------------------------------------------------------
-- 5. SESSIONS (5 vòng)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard room vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Room', @part_room);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word room vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Room', @part_room);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking room vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Room', @part_room);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order room vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Room', @part_room);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop room vocabulary', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Room/drag_drop_animal.webp',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=bedroom&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','sleep',       'x',0.118, 'y',0.2454,'width',0.14,'height',0.0853),
    JSON_OBJECT('word','watch TV',    'x',0.2343,'y',0.3505,'width',0.14,'height',0.0853),
    JSON_OBJECT('word','take a bath', 'x',0.373, 'y',0.2118,'width',0.14,'height',0.0853),
    JSON_OBJECT('word','play',        'x',0.1505,'y',0.7054,'width',0.14,'height',0.0853),
    JSON_OBJECT('word','eat',         'x',0.5343,'y',0.7212,'width',0.14,'height',0.0853),
    JSON_OBJECT('word','cook',        'x',0.698, 'y',0.6142,'width',0.14,'height',0.0853)
  )
),
 'Drag Drop: Room', @part_room);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================