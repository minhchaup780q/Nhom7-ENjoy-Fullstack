-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Free Time Activities (tạo mới)
-- 1 part duy nhất: Free Time Activities
-- 13 vocab + session 1..5
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
-- 1. TOPIC: Free Time Activities (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Free time activities', 16,
 'https://example.com/placeholder-free-time-activities-thumbnail.webp',
 'Free Time Activities', @level_pre_a1);

SET @topic_free_time := LAST_INSERT_ID();

SELECT @topic_free_time AS topic_free_time_id;

-- ------------------------------------------------------------
-- 2. PART: Free Time Activities
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Free Time Activities', @topic_free_time);

SET @part_free_time := LAST_INSERT_ID();

SELECT @part_free_time AS part_free_time_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (13 từ)
-- ------------------------------------------------------------

-- bag
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=bag&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/bag.webp',
 'túi xách', 'bag');
SET @v_bag := LAST_INSERT_ID();

-- camera
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=camera&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/camera.webp',
 'máy ảnh', 'camera');
SET @v_camera := LAST_INSERT_ID();

-- enjoy
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=enjoy&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/enjoy.webp',
 'tận hưởng', 'enjoy');
SET @v_enjoy := LAST_INSERT_ID();

-- fish
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=fish&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/fish.webp',
 'câu cá', 'fish');
SET @v_fish := LAST_INSERT_ID();

-- fly a kite
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=fly+a+kite&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/fly_a_kite.webp',
 'thả diều', 'fly a kite');
SET @v_fly_a_kite := LAST_INSERT_ID();

-- hat
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=hat&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/hat.webp',
 'cái mũ', 'hat');
SET @v_hat := LAST_INSERT_ID();

-- have fun
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=have+fun&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/have_fun.webp',
 'vui vẻ', 'have fun');
SET @v_have_fun := LAST_INSERT_ID();

-- listen to music
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=listen+to+music&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/listen_to_music.webp',
 'nghe nhạc', 'listen to music');
SET @v_listen_to_music := LAST_INSERT_ID();

-- play football
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=play+football&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/play_football.webp',
 'chơi đá bóng', 'play football');
SET @v_play_football := LAST_INSERT_ID();

-- run
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=run&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/run.webp',
 'chạy', 'run');
SET @v_run := LAST_INSERT_ID();

-- sunglasses
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=sunglasses&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/sunglasses.webp',
 'kính mát', 'sunglasses');
SET @v_sunglasses := LAST_INSERT_ID();

-- swim
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=swim&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/swim.webp',
 'bơi lội', 'swim');
SET @v_swim := LAST_INSERT_ID();

-- take photos
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=take+photos&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/take_photos.webp',
 'chụp ảnh', 'take photos');
SET @v_take_photos := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Free Time Activities với 13 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_free_time, @v_bag),
(NOW(), 1, 0, NOW(), 1, 2,  @part_free_time, @v_camera),
(NOW(), 1, 0, NOW(), 1, 3,  @part_free_time, @v_enjoy),
(NOW(), 1, 0, NOW(), 1, 4,  @part_free_time, @v_fish),
(NOW(), 1, 0, NOW(), 1, 5,  @part_free_time, @v_fly_a_kite),
(NOW(), 1, 0, NOW(), 1, 6,  @part_free_time, @v_hat),
(NOW(), 1, 0, NOW(), 1, 7,  @part_free_time, @v_have_fun),
(NOW(), 1, 0, NOW(), 1, 8,  @part_free_time, @v_listen_to_music),
(NOW(), 1, 0, NOW(), 1, 9,  @part_free_time, @v_play_football),
(NOW(), 1, 0, NOW(), 1, 10, @part_free_time, @v_run),
(NOW(), 1, 0, NOW(), 1, 11, @part_free_time, @v_sunglasses),
(NOW(), 1, 0, NOW(), 1, 12, @part_free_time, @v_swim),
(NOW(), 1, 0, NOW(), 1, 13, @part_free_time, @v_take_photos);

-- ------------------------------------------------------------
-- 5. SESSIONS (5 vòng)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard free time activities vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Free Time Activities', @part_free_time);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word free time activities vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Free Time Activities', @part_free_time);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking free time activities vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Free Time Activities', @part_free_time);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order free time activities vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Free Time Activities', @part_free_time);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop free time activities vocabulary', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FreeTimeActivities/drag_drop_Free_Time_Activities.webp',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=bag&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','play football','x',0.192, 'y',0.6046,'width',0.1087,'height',0.0756),
    JSON_OBJECT('word','run',          'x',0.0054,'y',0.1884,'width',0.1087,'height',0.0756),
    JSON_OBJECT('word','fly a kite',   'x',0.4105,'y',0.2551,'width',0.1087,'height',0.0756),
    JSON_OBJECT('word','swim',         'x',0.553, 'y',0.2573,'width',0.1087,'height',0.0756),
    JSON_OBJECT('word','fish',         'x',0.8392,'y',0.1128,'width',0.1087,'height',0.0756),
    JSON_OBJECT('word','take photos',  'x',0.758, 'y',0.5017,'width',0.1087,'height',0.0756),
    JSON_OBJECT('word','walk',         'x',0.6517,'y',0.784, 'width',0.1087,'height',0.0756)
  )
),
 'Drag Drop: Free Time Activities', @part_free_time);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================