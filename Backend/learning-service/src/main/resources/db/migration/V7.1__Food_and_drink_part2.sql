-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Food and drink (đã tồn tại)
-- PART 2: Food and drink 2 (order_index = 2)
-- 9 vocab + session 1..4
--   FLASHCARD, MATCH_WORD, SPEAKING, RE_ORDER (không có DRAG_DROP)
-- Chạy chung session với file part 1 (topic + part 1 đã có)
-- Áp dụng AUTO_INCREMENT + LAST_INSERT_ID(), không gán ID cố định
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 0. LẤY LẠI topic_id CỦA FOOD AND DRINK (topic đã tồn tại)
-- ------------------------------------------------------------
SET @topic_food_drink := (
  SELECT id FROM topics WHERE title = 'Food and drink' LIMIT 1
);

SELECT @topic_food_drink AS topic_food_drink_id;

-- ------------------------------------------------------------
-- 1. TẠO PART 2: Food and drink 2
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 2, 'Food and drink 2', @topic_food_drink);

SET @part_food_drink_2 := LAST_INSERT_ID();

SELECT @part_food_drink_2 AS part_food_drink_2_id;

-- ------------------------------------------------------------
-- 2. VOCABULARIES (9 từ — tạo mới hoàn toàn)
-- ------------------------------------------------------------

-- fruit
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=fruit&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/fruit.webp',
 'trái cây', 'fruit');
SET @v_fruit := LAST_INSERT_ID();

-- apple
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=apple&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/apple.webp',
 'quả táo', 'apple');
SET @v_apple := LAST_INSERT_ID();

-- grapes
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=grapes&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/grapes.webp',
 'quả nho', 'grapes');
SET @v_grapes := LAST_INSERT_ID();

-- orange
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=orange&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/orange.webp',
 'quả cam', 'orange');
SET @v_orange := LAST_INSERT_ID();

-- juice
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=juice&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/juice.webp',
 'nước ép', 'juice');
SET @v_juice := LAST_INSERT_ID();

-- meatballs
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=meatballs&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/meatballs.webp',
 'thịt viên', 'meatballs');
SET @v_meatballs := LAST_INSERT_ID();

-- beans
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=beans&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/beans.webp',
 'hạt đậu', 'beans');
SET @v_beans := LAST_INSERT_ID();

-- sausage
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=sausage&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/sausage.webp',
 'xúc xích', 'sausage');
SET @v_sausage := LAST_INSERT_ID();

-- meat
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=meat&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/FoodAndDrink/meat.webp',
 'thịt', 'meat');
SET @v_meat := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 3. PART_VOCABULARIES (nối part Food and drink 2 với 9 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, @part_food_drink_2, @v_fruit),
(NOW(), 1, 0, NOW(), 1, 2, @part_food_drink_2, @v_apple),
(NOW(), 1, 0, NOW(), 1, 3, @part_food_drink_2, @v_grapes),
(NOW(), 1, 0, NOW(), 1, 4, @part_food_drink_2, @v_orange),
(NOW(), 1, 0, NOW(), 1, 5, @part_food_drink_2, @v_juice),
(NOW(), 1, 0, NOW(), 1, 6, @part_food_drink_2, @v_meatballs),
(NOW(), 1, 0, NOW(), 1, 7, @part_food_drink_2, @v_beans),
(NOW(), 1, 0, NOW(), 1, 8, @part_food_drink_2, @v_sausage),
(NOW(), 1, 0, NOW(), 1, 9, @part_food_drink_2, @v_meat);

-- ------------------------------------------------------------
-- 4. SESSIONS (4 vòng, payload NULL)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard food and drink vocabulary', 'FLASHCARD', 1, NULL,
 'Flashcard: Food and drink', @part_food_drink_2);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word food and drink vocabulary', 'MATCH_WORD', 2, NULL,
 'Match Word: Food and drink', @part_food_drink_2);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking food and drink vocabulary', 'SPEAKING', 3, NULL,
 'Speaking: Food and drink', @part_food_drink_2);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order food and drink vocabulary', 'RE_ORDER', 4, NULL,
 'Re-order: Food and drink', @part_food_drink_2);

-- ============================================================
-- KHÔNG reset AUTO_INCREMENT
-- ============================================================