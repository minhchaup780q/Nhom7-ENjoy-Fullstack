-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Sport (tạo mới)
-- PART 1: Sport 1 (part duy nhất)
-- 10 vocab + session 1..5
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
-- 1. TOPIC: Sport (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Sports', 15,
 'https://example.com/placeholder-sport-thumbnail.webp',
 'Sport', @level_pre_a1);

SET @topic_sport := LAST_INSERT_ID();

SELECT @topic_sport AS topic_sport_id;

-- ------------------------------------------------------------
-- 2. PART: Sport 1
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Sport 1', @topic_sport);

SET @part_sport_1 := LAST_INSERT_ID();

SELECT @part_sport_1 AS part_sport_1_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (10 từ)
-- ------------------------------------------------------------

-- catch a ball
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=catch+a+ball&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/catch_a_ball.webp',
 'bắt bóng', 'catch a ball');
SET @v_catch_a_ball := LAST_INSERT_ID();

-- hit a ball
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=hit+a+ball&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/hit_a_ball.webp',
 'đánh bóng', 'hit a ball');
SET @v_hit_a_ball := LAST_INSERT_ID();

-- kick a ball
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=kick+a+ball&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/kick_a_ball.webp',
 'đá bóng', 'kick a ball');
SET @v_kick_a_ball := LAST_INSERT_ID();

-- play baseball
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=play+baseball&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/play_baseball.webp',
 'chơi bóng chày', 'play baseball');
SET @v_play_baseball := LAST_INSERT_ID();

-- play basketball
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=play+basketball&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/play_basketball.webp',
 'chơi bóng rổ', 'play basketball');
SET @v_play_basketball := LAST_INSERT_ID();

-- play football
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=play+football&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/play_football.webp',
 'chơi bóng đá', 'play football');
SET @v_play_football := LAST_INSERT_ID();

-- ride a horse
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=ride+a+horse&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/ride_a_horse.webp',
 'cưỡi ngựa', 'ride a horse');
SET @v_ride_a_horse := LAST_INSERT_ID();

-- ride a skateboard
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=ride+a+skateboard&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/ride_a_skateboard.webp',
 'trượt ván', 'ride a skateboard');
SET @v_ride_a_skateboard := LAST_INSERT_ID();

-- run
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=run&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/run.webp',
 'chạy', 'run');
SET @v_run := LAST_INSERT_ID();

-- throw a ball
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=throw+a+ball&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/throw_a_ball.webp',
 'ném bóng', 'throw a ball');
SET @v_throw_a_ball := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Sport 1 với 10 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_sport_1, @v_catch_a_ball),
(NOW(), 1, 0, NOW(), 1, 2,  @part_sport_1, @v_hit_a_ball),
(NOW(), 1, 0, NOW(), 1, 3,  @part_sport_1, @v_kick_a_ball),
(NOW(), 1, 0, NOW(), 1, 4,  @part_sport_1, @v_play_baseball),
(NOW(), 1, 0, NOW(), 1, 5,  @part_sport_1, @v_play_basketball),
(NOW(), 1, 0, NOW(), 1, 6,  @part_sport_1, @v_play_football),
(NOW(), 1, 0, NOW(), 1, 7,  @part_sport_1, @v_ride_a_horse),
(NOW(), 1, 0, NOW(), 1, 8,  @part_sport_1, @v_ride_a_skateboard),
(NOW(), 1, 0, NOW(), 1, 9,  @part_sport_1, @v_run),
(NOW(), 1, 0, NOW(), 1, 10, @part_sport_1, @v_throw_a_ball);

-- ------------------------------------------------------------
-- 5. SESSIONS (5 vòng)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard sport vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Sport', @part_sport_1);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word sport vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Sport', @part_sport_1);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking sport vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Sport', @part_sport_1);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order sport vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Sport', @part_sport_1);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop sport vocabulary', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/drag_drop_sport_part1.webp',
  'audio_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/drag_drop_sport1.mp3',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','run',           'x',0.3942,'y',0.5639,'width',0.1563,'height',0.0889),
    JSON_OBJECT('word','kick a ball',   'x',0.373, 'y',0.2773,'width',0.1563,'height',0.0889),
    JSON_OBJECT('word','play football', 'x',0.0479,'y',0.0951,'width',0.1563,'height',0.0889),
    JSON_OBJECT('word','play baseball', 'x',0.6442,'y',0.0951,'width',0.1563,'height',0.0889),
    JSON_OBJECT('word','hit a ball',    'x',0.5205,'y',0.424, 'width',0.1563,'height',0.0889)
  )
),
 'Drag Drop: Sport', @part_sport_1);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================