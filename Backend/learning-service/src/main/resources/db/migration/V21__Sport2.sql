-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Sport (đã tồn tại)
-- PART 2: Sport 2 (order_index = 2)
-- 10 vocab + session 1..5
--   FLASHCARD, MATCH_WORD, SPEAKING, RE_ORDER, DRAG_DROP
-- Chạy chung session với file part 1 (topic + part 1 đã có)
-- Áp dụng AUTO_INCREMENT + LAST_INSERT_ID(), không gán ID cố định
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 0. LẤY LẠI topic_id CỦA SPORT (topic đã tồn tại)
-- ------------------------------------------------------------
SET @topic_sport := (
  SELECT id FROM topics WHERE title = 'Sport' LIMIT 1
);

SELECT @topic_sport AS topic_sport_id;

-- ------------------------------------------------------------
-- 1. TẠO PART 2: Sport 2
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 2, 'Sport 2', @topic_sport);

SET @part_sport_2 := LAST_INSERT_ID();

SELECT @part_sport_2 AS part_sport_2_id;

-- ------------------------------------------------------------
-- 2. VOCABULARIES (10 từ)
-- ------------------------------------------------------------

-- draw
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=draw&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/draw.webp',
 'vẽ', 'draw');
SET @v_draw := LAST_INSERT_ID();

-- paint
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=paint&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/paint.webp',
 'tô màu', 'paint');
SET @v_paint := LAST_INSERT_ID();

-- play badminton
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=play+badminton&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/play_badminton.webp',
 'chơi cầu lông', 'play badminton');
SET @v_play_badminton := LAST_INSERT_ID();

-- play hockey
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=play+hockey&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/play_hockey.webp',
 'chơi khúc côn cầu', 'play hockey');
SET @v_play_hockey := LAST_INSERT_ID();

-- play tennis
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=play+tennis&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/play_tennis.webp',
 'chơi quần vợt', 'play tennis');
SET @v_play_tennis := LAST_INSERT_ID();

-- play the guitar
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=play+the+guitar&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/play_the_guitar.webp',
 'chơi đàn ghi-ta', 'play the guitar');
SET @v_play_the_guitar := LAST_INSERT_ID();

-- play the piano
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=play+the+piano&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/play_the_piano.webp',
 'chơi đàn piano', 'play the piano');
SET @v_play_the_piano := LAST_INSERT_ID();

-- ride a bike
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=ride+a+bike&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/ride_a_bike.webp',
 'đạp xe đạp', 'ride a bike');
SET @v_ride_a_bike := LAST_INSERT_ID();

-- swim
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=swim&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/swim.webp',
 'bơi lội', 'swim');
SET @v_swim := LAST_INSERT_ID();

-- watch television
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=watch+television&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/watch_television.webp',
 'xem tivi', 'watch television');
SET @v_watch_television := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 3. PART_VOCABULARIES (nối part Sport 2 với 10 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_sport_2, @v_draw),
(NOW(), 1, 0, NOW(), 1, 2,  @part_sport_2, @v_paint),
(NOW(), 1, 0, NOW(), 1, 3,  @part_sport_2, @v_play_badminton),
(NOW(), 1, 0, NOW(), 1, 4,  @part_sport_2, @v_play_hockey),
(NOW(), 1, 0, NOW(), 1, 5,  @part_sport_2, @v_play_tennis),
(NOW(), 1, 0, NOW(), 1, 6,  @part_sport_2, @v_play_the_guitar),
(NOW(), 1, 0, NOW(), 1, 7,  @part_sport_2, @v_play_the_piano),
(NOW(), 1, 0, NOW(), 1, 8,  @part_sport_2, @v_ride_a_bike),
(NOW(), 1, 0, NOW(), 1, 9,  @part_sport_2, @v_swim),
(NOW(), 1, 0, NOW(), 1, 10, @part_sport_2, @v_watch_television);

-- ------------------------------------------------------------
-- 4. SESSIONS (5 vòng)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard sport vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Sport', @part_sport_2);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word sport vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Sport', @part_sport_2);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking sport vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Sport', @part_sport_2);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order sport vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Sport', @part_sport_2);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop sport vocabulary', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Sport/drag_drop_part2.webp',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=draw&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','Alex', 'x',0.328, 'y',0.1217,'width',0.1288,'height',0.0689),
    JSON_OBJECT('word','Tom',  'x',0.6505,'y',0.0439,'width',0.1288,'height',0.0689),
    JSON_OBJECT('word','May',  'x',0.5354,'y',0.2906,'width',0.1288,'height',0.0689),
    JSON_OBJECT('word','Anna', 'x',0.188, 'y',0.3773,'width',0.1288,'height',0.0689),
    JSON_OBJECT('word','Hugo', 'x',0.8105,'y',0.4417,'width',0.1288,'height',0.0689)
  )
),
 'Drag Drop: Sport', @part_sport_2);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================