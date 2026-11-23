-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Food and drink (tạo mới)
-- 1 part duy nhất: Food and drink
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
-- 1. TOPIC: Food and drink (tạo mới)
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Food and drink', 7,
 'https://example.com/placeholder-food-and-drink-thumbnail.webp',
 'Food and drink', @level_pre_a1);

SET @topic_food_drink := LAST_INSERT_ID();

SELECT @topic_food_drink AS topic_food_drink_id;

-- ------------------------------------------------------------
-- 2. PART: Food and drink (part duy nhất)
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Food and drink', @topic_food_drink);

SET @part_food_drink := LAST_INSERT_ID();

SELECT @part_food_drink AS part_food_drink_id;

-- ------------------------------------------------------------
-- 3. VOCABULARIES (10 từ)
-- ------------------------------------------------------------

-- burger
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=burger&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/burger.webp',
 'bánh burger', 'burger');
SET @v_burger := LAST_INSERT_ID();

-- chicken
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=chicken&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/chicken.webp',
 'thịt gà', 'chicken');
SET @v_chicken := LAST_INSERT_ID();

-- cake
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=cake&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/cake.webp',
 'bánh ngọt', 'cake');
SET @v_cake := LAST_INSERT_ID();

-- chocolate
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=chocolate&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/chocolate.webp',
 'sô-cô-la', 'chocolate');
SET @v_chocolate := LAST_INSERT_ID();

-- bread
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=bread&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/bread.webp',
 'bánh mì', 'bread');
SET @v_bread := LAST_INSERT_ID();

-- lemonade
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=lemonade&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/lemonade.webp',
 'nước chanh', 'lemonade');
SET @v_lemonade := LAST_INSERT_ID();

-- water
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=water&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/water.webp',
 'nước', 'water');
SET @v_water := LAST_INSERT_ID();

-- banana
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=banana&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/banana.webp',
 'quả chuối', 'banana');
SET @v_banana := LAST_INSERT_ID();

-- salad
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=salad&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/salad.webp',
 'rau trộn', 'salad');
SET @v_salad := LAST_INSERT_ID();

-- mango
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=mango&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/mango.webp',
 'quả xoài', 'mango');
SET @v_mango := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES (nối part Food and drink với 10 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_food_drink, @v_burger),
(NOW(), 1, 0, NOW(), 1, 2,  @part_food_drink, @v_chicken),
(NOW(), 1, 0, NOW(), 1, 3,  @part_food_drink, @v_cake),
(NOW(), 1, 0, NOW(), 1, 4,  @part_food_drink, @v_chocolate),
(NOW(), 1, 0, NOW(), 1, 5,  @part_food_drink, @v_bread),
(NOW(), 1, 0, NOW(), 1, 6,  @part_food_drink, @v_lemonade),
(NOW(), 1, 0, NOW(), 1, 7,  @part_food_drink, @v_water),
(NOW(), 1, 0, NOW(), 1, 8,  @part_food_drink, @v_banana),
(NOW(), 1, 0, NOW(), 1, 9,  @part_food_drink, @v_salad),
(NOW(), 1, 0, NOW(), 1, 10, @part_food_drink, @v_mango);

-- ------------------------------------------------------------
-- 5. SESSIONS (5 vòng)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard food and drink vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Food and drink', @part_food_drink);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word food and drink vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Food and drink', @part_food_drink);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking food and drink vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Food and drink', @part_food_drink);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order food and drink vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Food and drink', @part_food_drink);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop food and drink vocabulary', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/drag_drop_foodanddrink.webp',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=burger&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','2', 'x',0.5917,'y',0.4777,'width',0.1313,'height',0.0863),
    JSON_OBJECT('word','3', 'x',0.318, 'y',0.3877,'width',0.1313,'height',0.0863),
    JSON_OBJECT('word','5', 'x',0.4467,'y',0.669, 'width',0.1313,'height',0.0863),
    JSON_OBJECT('word','4', 'x',0.683, 'y',0.7346,'width',0.1313,'height',0.0863),
    JSON_OBJECT('word','7', 'x',0.503, 'y',0.2302,'width',0.1313,'height',0.0863),
    JSON_OBJECT('word','8', 'x',0.683, 'y',0.3202,'width',0.1313,'height',0.0863),
    JSON_OBJECT('word','9', 'x',0.8355,'y',0.384, 'width',0.1313,'height',0.0863),
    JSON_OBJECT('word','6', 'x',0.8417,'y',0.6071,'width',0.1313,'height',0.0863),
    JSON_OBJECT('word','10','x',0.2293,'y',0.6821,'width',0.1313,'height',0.0863)
  )
),
 'Drag Drop: Food and drink', @part_food_drink);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================