-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               12.3.2-MariaDB - MariaDB Server
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

USE `enjoy_learning_db`;

-- =====================================================
-- LEVEL: preA1
-- =====================================================
INSERT INTO `levels` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `code`, `name`, `order_index`) VALUES
	(3, NOW(), NULL, b'0', NOW(), NULL, 'PRE_A1', 'Pre A1 - Beginner', 1);

-- =====================================================
-- TOPIC 1: THE BODY AND THE FACE
-- =====================================================
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`) VALUES
	(3, NOW(), NULL, b'0', NOW(), NULL, 'Learn about body parts and face.', 1, '/images/topics/body.png', 'THE BODY AND THE FACE', 3);

-- Part 1: Body and Face
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(4, NOW(), NULL, b'0', NOW(), NULL, 1, 'Body and Face - Part 1', 3);

-- Session 1: INTRODUCTION - Body and Face Part 1 (FLASHCARD with full sentences)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(16, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn body parts and face vocabulary.', 1, 'INTRODUCTION', 'UNLOCK', 'Meet Your Body', 4);

-- Session Items for Session 16 (FLASHCARD - full sentences)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(48, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+head&type=2', 'I have got a head.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/head.webp', 'FLASHCARD', 'head', 'Tôi có một cái đầu.'),
	(49, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+face&type=2', 'I have got a face.', 'https://images.unsplash.com/photo-1549068106-b024baf5062d?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'face', 'Tôi có một khuôn mặt.'),
	(50, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+eyes&type=2', 'I have got two eyes.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/eyes.webp', 'FLASHCARD', 'eyes', 'Tôi có hai con mắt.'),
	(51, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+ears&type=2', 'I have got two ears.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ears.webp', 'FLASHCARD', 'ears', 'Tôi có hai cái tai.'),
	(52, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+nose&type=2', 'I have got a nose.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/nose.webp', 'FLASHCARD', 'nose', 'Tôi có một cái mũi.'),
	(53, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+small+mouth&type=2', 'I have got a small mouth.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/mouth.webp', 'FLASHCARD', 'mouth', 'Tôi có một cái miệng nhỏ.'),
	(54, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+black+hair&type=2', 'I have got black hair.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hair.webp', 'FLASHCARD', 'hair', 'Tôi có tóc đen.'),
	(55, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+happy+smile&type=2', 'I have got a happy smile.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/smile.webp', 'FLASHCARD', 'smile', 'Tôi có một nụ cười hạnh phúc.');

-- Session 2: LISTENING - Body and Face Part 1
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(17, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice body vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Body Words', 4);

-- Session 3: SPEAKING - Body and Face Part 1
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(18, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking body vocabulary.', 3, 'SPEAKING', 'LOCK', 'Say Body Words', 4);

-- Session 4: WORD_RECOGNITION - Body and Face Part 1 (QUIZ)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(19, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: Identify body parts.', 4, 'WORD_RECOGNITION', 'LOCK', 'Body Quiz', 4);

-- Session Items for Session 19 (QUIZ - question and answer)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(57, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/head.webp', 'QUIZ', 'head', 'Bạn có gì?'),
	(542, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://images.unsplash.com/photo-1549068106-b024baf5062d?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'face', 'Bạn có gì?'),
	(543, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/eyes.webp', 'QUIZ', 'eyes', 'Bạn có gì?'),
	(544, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ears.webp', 'QUIZ', 'ears', 'Bạn có gì?'),
	(545, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/nose.webp', 'QUIZ', 'nose', 'Bạn có gì?'),
	(546, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/mouth.webp', 'QUIZ', 'mouth', 'Bạn có gì?'),
	(547, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hair.webp', 'QUIZ', 'hair', 'Bạn có gì?'),
	(548, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/smile.webp', 'QUIZ', 'smile', 'Bạn có gì?');

-- Session 5: GAMIFIED_REVIEW - Body and Face Part 1 (FILL_IN_BLANK)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(20, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review body vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Body Adventure', 4);

-- Session Items for Session 20 (GAMIFIED_REVIEW - FILL_IN_BLANK with full sentences)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(58, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+head&type=2', 'I have got a [head].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/head.webp', 'FILL_IN_BLANK', 'head', 'Tôi có một cái đầu.'),
	(59, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+black+hair&type=2', 'I have got [black] hair.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/black.webp', 'FILL_IN_BLANK', 'black', 'Tôi có tóc đen.'),
	(60, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+round+face&type=2', 'I have got a [round] face.', 'https://images.unsplash.com/photo-1549068106-b024baf5062d?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'round', 'Tôi có khuôn mặt tròn.'),
	(61, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+eyes&type=2', 'I have got two [eyes].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/eyes.webp', 'FILL_IN_BLANK', 'eyes', 'Tôi có hai con mắt.'),
	(62, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+ears&type=2', 'I have got two [ears].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/ears.webp', 'FILL_IN_BLANK', 'ears', 'Tôi có hai cái tai.'),
	(63, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+nose&type=2', 'I have got a [nose].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/nose.webp', 'FILL_IN_BLANK', 'nose', 'Tôi có một cái mũi.'),
	(64, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+small+mouth&type=2', 'I have got a [small] mouth.', 'https://images.unsplash.com/photo-1587061949409-02e5a2f4d05d?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'small', 'Tôi có một cái miệng nhỏ.'),
	(65, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+happy+smile&type=2', 'I have got a happy [smile].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/smile.webp', 'FILL_IN_BLANK', 'smile', 'Tôi có một nụ cười hạnh phúc.');

-- Part 2: Body and Face Part 2
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(5, NOW(), NULL, b'0', NOW(), NULL, 2, 'Body and Face - Part 2', 3);

-- Session 1: INTRODUCTION - Body and Face Part 2 (FLASHCARD with full sentences)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(21, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn body parts vocabulary.', 1, 'INTRODUCTION', 'LOCK', 'More Body Words', 5);

-- Session Items for Session 21 (FLASHCARD - full sentences)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(66, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+arms&type=2', 'I have got two arms.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/arms.webp', 'FLASHCARD', 'arms', 'Tôi có hai cánh tay.'),
	(67, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+hands&type=2', 'I have got two hands.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hands.webp', 'FLASHCARD', 'hands', 'Tôi có hai bàn tay.'),
	(68, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+strong+body&type=2', 'I have got a strong body.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/body.webp', 'FLASHCARD', 'body', 'Tôi có một cơ thể khỏe mạnh.'),
	(69, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+legs&type=2', 'I have got two legs.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/legs.webp', 'FLASHCARD', 'legs', 'Tôi có hai chân.'),
	(70, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+feet&type=2', 'I have got two feet.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/feet.webp', 'FLASHCARD', 'feet', 'Tôi có hai bàn chân.');

-- Session 2: LISTENING - Body and Face Part 2
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(22, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice body vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen More', 5);

-- Session 3: SPEAKING - Body and Face Part 2
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(23, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking body vocabulary.', 3, 'SPEAKING', 'LOCK', 'Say More Words', 5);

-- Session 4: WORD_RECOGNITION - Body and Face Part 2 (QUIZ)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(24, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: Identify body parts.', 4, 'WORD_RECOGNITION', 'LOCK', 'More Body Quiz', 5);

-- Session Items for Session 24 (QUIZ)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(71, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/arms.webp', 'QUIZ', 'arms', 'Bạn có gì?'),
	(549, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hands.webp', 'QUIZ', 'hands', 'Bạn có gì?'),
	(550, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/body.webp', 'QUIZ', 'body', 'Bạn có gì?'),
	(551, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/legs.webp', 'QUIZ', 'legs', 'Bạn có gì?'),
	(552, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/feet.webp', 'QUIZ', 'feet', 'Bạn có gì?');

-- Session 5: GAMIFIED_REVIEW - Body and Face Part 2 (FILL_IN_BLANK)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(25, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review body vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Body Challenge', 5);

-- Session Items for Session 25 (FILL_IN_BLANK)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(72, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+arms&type=2', 'I have got two [arms].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/arms.webp', 'FILL_IN_BLANK', 'arms', 'Tôi có hai cánh tay.'),
	(73, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+hands&type=2', 'I have got two [hands].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hands.webp', 'FILL_IN_BLANK', 'hands', 'Tôi có hai bàn tay.'),
	(74, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+strong+body&type=2', 'I have got a strong [body].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/body.webp', 'FILL_IN_BLANK', 'body', 'Tôi có một cơ thể khỏe mạnh.'),
	(75, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+legs&type=2', 'I have got two [legs].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/legs.webp', 'FILL_IN_BLANK', 'legs', 'Tôi có hai chân.'),
	(76, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+feet&type=2', 'I have got two [feet].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/feet.webp', 'FILL_IN_BLANK', 'feet', 'Tôi có hai bàn chân.');

-- =====================================================
-- TOPIC 2: FAMILY & FRIENDS
-- =====================================================
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`) VALUES
	(4, NOW(), NULL, b'0', NOW(), NULL, 'Learn about family members and friends.', 2, '/images/topics/family.png', 'FAMILY & FRIENDS', 3);

-- Part 1: Family Members
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(6, NOW(), NULL, b'0', NOW(), NULL, 1, 'Family Members - Part 1', 4);

-- Session 1: INTRODUCTION - Family Part 1 (FLASHCARD with full sentences)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(26, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn family vocabulary.', 1, 'INTRODUCTION', 'LOCK', 'Meet the Family', 6);

-- Session Items for Session 26 (FLASHCARD - full sentences)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(77, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+mother&type=2', 'This is my mother.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/mother.webp', 'FLASHCARD', 'mother', 'Đây là mẹ của tôi.'),
	(78, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+father&type=2', 'This is my father.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/father.webp', 'FLASHCARD', 'father', 'Đây là bố của tôi.'),
	(79, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+sister&type=2', 'This is my sister.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/sister.webp', 'FLASHCARD', 'sister', 'Đây là chị/em gái của tôi.'),
	(80, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+brother&type=2', 'This is my brother.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/brother.webp', 'FLASHCARD', 'brother', 'Đây là anh/em trai của tôi.'),
	(81, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+baby&type=2', 'This is my baby.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/baby.webp', 'FLASHCARD', 'baby', 'Đây là em bé của tôi.'),
	(82, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+family&type=2', 'This is my family.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/family.webp', 'FLASHCARD', 'family', 'Đây là gia đình của tôi.');

-- Session 2: LISTENING - Family Part 1
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(27, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice family vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Family', 6);

-- Session 3: SPEAKING - Family Part 1
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(28, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking family vocabulary.', 3, 'SPEAKING', 'LOCK', 'Say Family Words', 6);

-- Session 4: WORD_RECOGNITION - Family Part 1 (QUIZ)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(29, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: Who is this?', 4, 'WORD_RECOGNITION', 'LOCK', 'Family Quiz', 6);

-- Session Items for Session 29 (QUIZ)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(83, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Who+is+this&type=2', 'Who is this?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/mother.webp', 'QUIZ', 'mother', 'Đây là ai?'),
	(553, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Who+is+this&type=2', 'Who is this?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/father.webp', 'QUIZ', 'father', 'Đây là ai?'),
	(554, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Who+is+this&type=2', 'Who is this?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/sister.webp', 'QUIZ', 'sister', 'Đây là ai?'),
	(555, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Who+is+this&type=2', 'Who is this?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/brother.webp', 'QUIZ', 'brother', 'Đây là ai?'),
	(556, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Who+is+this&type=2', 'Who is this?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/baby.webp', 'QUIZ', 'baby', 'Đây là ai?'),
	(557, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Who+is+this&type=2', 'Who is this?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/family.webp', 'QUIZ', 'family', 'Đây là ai?');

-- Session 5: GAMIFIED_REVIEW - Family Part 1 (FILL_IN_BLANK)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(30, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review family vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Family Adventure', 6);

-- Session Items for Session 30 (FILL_IN_BLANK)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(84, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+mother&type=2', 'This is my [mother].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/mother.webp', 'FILL_IN_BLANK', 'mother', 'Đây là mẹ của tôi.'),
	(85, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+father&type=2', 'This is my [father].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/father.webp', 'FILL_IN_BLANK', 'father', 'Đây là bố của tôi.'),
	(86, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+sister&type=2', 'This is my [sister].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/sister.webp', 'FILL_IN_BLANK', 'sister', 'Đây là chị/em gái của tôi.'),
	(87, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+brother&type=2', 'This is my [brother].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/brother.webp', 'FILL_IN_BLANK', 'brother', 'Đây là anh/em trai của tôi.'),
	(88, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+baby&type=2', 'This is my [baby].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/baby.webp', 'FILL_IN_BLANK', 'baby', 'Đây là em bé của tôi.'),
	(89, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=This+is+my+family&type=2', 'This is my [family].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/family.webp', 'FILL_IN_BLANK', 'family', 'Đây là gia đình của tôi.');

-- =====================================================
-- TOPIC 4: ANIMALS
-- =====================================================
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`) VALUES
	(5, NOW(), NULL, b'0', NOW(), NULL, 'Learn about different animals.', 3, '/images/topics/animals.png', 'ANIMALS', 3);

-- Part 1: Pets
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(8, NOW(), NULL, b'0', NOW(), NULL, 1, 'Pets', 5);

-- Session 1: INTRODUCTION - Pets (FLASHCARD with full sentences)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(31, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn about pets.', 1, 'INTRODUCTION', 'LOCK', 'My Pets', 8);

-- Session Items for Session 31 (FLASHCARD - full sentences)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(90, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+cat&type=2', 'I have got a cat.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/cat.webp', 'FLASHCARD', 'cat', 'Tôi có một con mèo.'),
	(91, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+dog&type=2', 'I have got a dog.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/dog.webp', 'FLASHCARD', 'dog', 'Tôi có một con chó.'),
	(92, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+fish&type=2', 'I have got a fish.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/fish.webp', 'FLASHCARD', 'fish', 'Tôi có một con cá.'),
	(93, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+bird&type=2', 'I have got a bird.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bird.webp', 'FLASHCARD', 'bird', 'Tôi có một con chim.'),
	(94, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+mouse&type=2', 'I have got a mouse.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/mouse.webp', 'FLASHCARD', 'mouse', 'Tôi có một con chuột.'),
	(95, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+pet&type=2', 'I have got a pet.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/pet.webp', 'FLASHCARD', 'pet', 'Tôi có một con thú cưng.');

-- Session 2: LISTENING - Pets
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(32, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice pet vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Pets', 8);

-- Session 3: SPEAKING - Pets
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(33, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about pets.', 3, 'SPEAKING', 'LOCK', 'Say Pet Words', 8);

-- Session 4: WORD_RECOGNITION - Pets (QUIZ)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(34, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What have you got?', 4, 'WORD_RECOGNITION', 'LOCK', 'Pet Quiz', 8);

-- Session Items for Session 34 (QUIZ)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(96, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/cat.webp', 'QUIZ', 'cat', 'Bạn có gì?'),
	(558, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/dog.webp', 'QUIZ', 'dog', 'Bạn có gì?'),
	(559, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/fish.webp', 'QUIZ', 'fish', 'Bạn có gì?'),
	(560, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bird.webp', 'QUIZ', 'bird', 'Bạn có gì?'),
	(561, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/mouse.webp', 'QUIZ', 'mouse', 'Bạn có gì?'),
	(562, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/pet.webp', 'QUIZ', 'pet', 'Bạn có gì?');

-- Session 5: GAMIFIED_REVIEW - Pets (FILL_IN_BLANK)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(35, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review pet vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Pet Adventure', 8);

-- Session Items for Session 35 (FILL_IN_BLANK)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(97, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+cat&type=2', 'I have got a [cat].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/cat.webp', 'FILL_IN_BLANK', 'cat', 'Tôi có một con mèo.'),
	(98, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+dog&type=2', 'I have got a [dog].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/dog.webp', 'FILL_IN_BLANK', 'dog', 'Tôi có một con chó.'),
	(99, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+fish&type=2', 'I have got a [fish].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/fish.webp', 'FILL_IN_BLANK', 'fish', 'Tôi có một con cá.'),
	(100, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+bird&type=2', 'I have got a [bird].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bird.webp', 'FILL_IN_BLANK', 'bird', 'Tôi có một con chim.'),
	(101, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+a+mouse&type=2', 'I have got a [mouse].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/mouse.webp', 'FILL_IN_BLANK', 'mouse', 'Tôi có một con chuột.'),
	(102, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+got+two+mice&type=2', 'I have got two [mice].', 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'mice', 'Tôi có hai con chuột.');

-- Part 2: Farm Animals
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(9, NOW(), NULL, b'0', NOW(), NULL, 2, 'Farm Animals', 5);

-- Session 1: INTRODUCTION - Farm Animals (FLASHCARD with full sentences)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(36, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn about farm animals.', 1, 'INTRODUCTION', 'LOCK', 'Farm Animals', 9);

-- Session Items for Session 36 (FLASHCARD - full sentences)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(103, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+cow&type=2', 'It is a cow.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/cow.webp', 'FLASHCARD', 'cow', 'Nó là một con bò.'),
	(104, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+chicken&type=2', 'It is a chicken.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/chicken.webp', 'FLASHCARD', 'chicken', 'Nó là một con gà.'),
	(105, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+duck&type=2', 'It is a duck.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/duck.webp', 'FLASHCARD', 'duck', 'Nó là một con vịt.'),
	(106, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+goat&type=2', 'It is a goat.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/goat.webp', 'FLASHCARD', 'goat', 'Nó là một con dê.'),
	(107, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+horse&type=2', 'It is a horse.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/horse.webp', 'FLASHCARD', 'horse', 'Nó là một con ngựa.'),
	(108, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+sheep&type=2', 'It is a sheep.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/sheep.webp', 'FLASHCARD', 'sheep', 'Nó là một con cừu.'),
	(109, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+donkey&type=2', 'It is a donkey.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/donkey.webp', 'FLASHCARD', 'donkey', 'Nó là một con lừa.');

-- Session 2: LISTENING - Farm Animals
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(37, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice farm animal vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Farm Animals', 9);

-- Session 3: SPEAKING - Farm Animals
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(38, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about farm animals.', 3, 'SPEAKING', 'LOCK', 'Say Farm Animals', 9);

-- Session 4: WORD_RECOGNITION - Farm Animals (QUIZ)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(39, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What is it?', 4, 'WORD_RECOGNITION', 'LOCK', 'Farm Animal Quiz', 9);

-- Session Items for Session 39 (QUIZ)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(110, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/cow.webp', 'QUIZ', 'cow', 'Nó là gì?'),
	(563, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/chicken.webp', 'QUIZ', 'chicken', 'Nó là gì?'),
	(564, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/duck.webp', 'QUIZ', 'duck', 'Nó là gì?'),
	(565, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/goat.webp', 'QUIZ', 'goat', 'Nó là gì?'),
	(566, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/horse.webp', 'QUIZ', 'horse', 'Nó là gì?'),
	(567, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/sheep.webp', 'QUIZ', 'sheep', 'Nó là gì?'),
	(568, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/donkey.webp', 'QUIZ', 'donkey', 'Nó là gì?');

-- Session 5: GAMIFIED_REVIEW - Farm Animals (FILL_IN_BLANK)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(40, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review farm animal vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Farm Animal Adventure', 9);

-- Session Items for Session 40 (FILL_IN_BLANK)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(111, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+cow&type=2', 'It is a [cow].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/cow.webp', 'FILL_IN_BLANK', 'cow', 'Nó là một con bò.'),
	(112, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+chicken&type=2', 'It is a [chicken].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/chicken.webp', 'FILL_IN_BLANK', 'chicken', 'Nó là một con gà.'),
	(113, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+duck&type=2', 'It is a [duck].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/duck.webp', 'FILL_IN_BLANK', 'duck', 'Nó là một con vịt.'),
	(114, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+goat&type=2', 'It is a [goat].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/goat.webp', 'FILL_IN_BLANK', 'goat', 'Nó là một con dê.'),
	(115, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+horse&type=2', 'It is a [horse].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/horse.webp', 'FILL_IN_BLANK', 'horse', 'Nó là một con ngựa.'),
	(116, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+sheep&type=2', 'It is a [sheep].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/sheep.webp', 'FILL_IN_BLANK', 'sheep', 'Nó là một con cừu.'),
	(117, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+donkey&type=2', 'It is a [donkey].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/donkey.webp', 'FILL_IN_BLANK', 'donkey', 'Nó là một con lừa.');

-- Part 3: Wild Animals 1
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(10, NOW(), NULL, b'0', NOW(), NULL, 3, 'Wild Animals 1', 5);

-- Session 1: INTRODUCTION - Wild Animals 1 (FLASHCARD with full sentences)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(41, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn about wild animals.', 1, 'INTRODUCTION', 'LOCK', 'Wild Animals 1', 10);

-- Session Items for Session 41 (FLASHCARD - full sentences)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(118, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+bear&type=2', 'I can see a bear.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bear.webp', 'FLASHCARD', 'bear', 'Tôi có thể nhìn thấy một con gấu.'),
	(119, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+crocodile&type=2', 'I can see a crocodile.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/crocodile.webp', 'FLASHCARD', 'crocodile', 'Tôi có thể nhìn thấy một con cá sấu.'),
	(120, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+an+elephant&type=2', 'I can see an elephant.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/elephant.webp', 'FLASHCARD', 'elephant', 'Tôi có thể nhìn thấy một con voi.'),
	(121, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+giraffe&type=2', 'I can see a giraffe.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/giraffe.webp', 'FLASHCARD', 'giraffe', 'Tôi có thể nhìn thấy một con hươu cao cổ.'),
	(122, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+monkey&type=2', 'I can see a monkey.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/monkey.webp', 'FLASHCARD', 'monkey', 'Tôi có thể nhìn thấy một con khỉ.'),
	(123, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+tiger&type=2', 'I can see a tiger.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/tiger.webp', 'FLASHCARD', 'tiger', 'Tôi có thể nhìn thấy một con hổ.'),
	(124, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+zebra&type=2', 'I can see a zebra.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/zebra.webp', 'FLASHCARD', 'zebra', 'Tôi có thể nhìn thấy một con ngựa vằn.');

-- Session 2: LISTENING - Wild Animals 1
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(42, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice wild animal vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Wild Animals', 10);

-- Session 3: SPEAKING - Wild Animals 1
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(43, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about wild animals.', 3, 'SPEAKING', 'LOCK', 'Say Wild Animals', 10);

-- Session 4: WORD_RECOGNITION - Wild Animals 1 (QUIZ)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(44, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What can you see?', 4, 'WORD_RECOGNITION', 'LOCK', 'Wild Animal Quiz 1', 10);

-- Session Items for Session 44 (QUIZ)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(125, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+can+you+see&type=2', 'What can you see?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bear.webp', 'QUIZ', 'bear', 'Bạn có thể nhìn thấy gì?'),
	(569, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+can+you+see&type=2', 'What can you see?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/crocodile.webp', 'QUIZ', 'crocodile', 'Bạn có thể nhìn thấy gì?'),
	(570, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+can+you+see&type=2', 'What can you see?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/elephant.webp', 'QUIZ', 'elephant', 'Bạn có thể nhìn thấy gì?'),
	(571, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+can+you+see&type=2', 'What can you see?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/giraffe.webp', 'QUIZ', 'giraffe', 'Bạn có thể nhìn thấy gì?'),
	(572, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+can+you+see&type=2', 'What can you see?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/monkey.webp', 'QUIZ', 'monkey', 'Bạn có thể nhìn thấy gì?'),
	(573, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+can+you+see&type=2', 'What can you see?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/tiger.webp', 'QUIZ', 'tiger', 'Bạn có thể nhìn thấy gì?'),
	(574, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+can+you+see&type=2', 'What can you see?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/zebra.webp', 'QUIZ', 'zebra', 'Bạn có thể nhìn thấy gì?');

-- Session 5: GAMIFIED_REVIEW - Wild Animals 1 (FILL_IN_BLANK)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(45, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review wild animal vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Wild Animal Adventure 1', 10);

-- Session Items for Session 45 (FILL_IN_BLANK)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(126, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+bear&type=2', 'I can see a [bear].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bear.webp', 'FILL_IN_BLANK', 'bear', 'Tôi có thể nhìn thấy một con gấu.'),
	(127, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+crocodile&type=2', 'I can see a [crocodile].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/crocodile.webp', 'FILL_IN_BLANK', 'crocodile', 'Tôi có thể nhìn thấy một con cá sấu.'),
	(128, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+an+elephant&type=2', 'I can see an [elephant].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/elephant.webp', 'FILL_IN_BLANK', 'elephant', 'Tôi có thể nhìn thấy một con voi.'),
	(129, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+giraffe&type=2', 'I can see a [giraffe].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/giraffe.webp', 'FILL_IN_BLANK', 'giraffe', 'Tôi có thể nhìn thấy một con hươu cao cổ.'),
	(130, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+monkey&type=2', 'I can see a [monkey].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/monkey.webp', 'FILL_IN_BLANK', 'monkey', 'Tôi có thể nhìn thấy một con khỉ.'),
	(131, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+tiger&type=2', 'I can see a [tiger].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/tiger.webp', 'FILL_IN_BLANK', 'tiger', 'Tôi có thể nhìn thấy một con hổ.'),
	(132, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+a+zebra&type=2', 'I can see a [zebra].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/zebra.webp', 'FILL_IN_BLANK', 'zebra', 'Tôi có thể nhìn thấy một con ngựa vằn.');

-- Part 4: Wild Animals 2
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(11, NOW(), NULL, b'0', NOW(), NULL, 4, 'Wild Animals 2', 5);

-- Session 1: INTRODUCTION - Wild Animals 2 (FLASHCARD with full sentences)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(46, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn more wild animals.', 1, 'INTRODUCTION', 'LOCK', 'Wild Animals 2', 11);

-- Session Items for Session 46 (FLASHCARD - full sentences)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(133, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+frog&type=2', 'It is a frog.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/frog.webp', 'FLASHCARD', 'frog', 'Nó là một con ếch.'),
	(134, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+hippo&type=2', 'It is a hippo.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hippo.webp', 'FLASHCARD', 'hippo', 'Nó là một con hà mã.'),
	(135, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+jellyfish&type=2', 'It is a jellyfish.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/jellyfish.webp', 'FLASHCARD', 'jellyfish', 'Nó là một con sứa.'),
	(136, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+lizard&type=2', 'It is a lizard.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/lizard.webp', 'FLASHCARD', 'lizard', 'Nó là một con thằn lằn.'),
	(137, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+polar+bear&type=2', 'It is a polar bear.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/polar-bear.webp', 'FLASHCARD', 'polar bear', 'Nó là một con gấu Bắc Cực.'),
	(138, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+snake&type=2', 'It is a snake.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/snake.webp', 'FLASHCARD', 'snake', 'Nó là một con rắn.'),
	(139, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+spider&type=2', 'It is a spider.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/spider.webp', 'FLASHCARD', 'spider', 'Nó là một con nhện.');

-- Session 2: LISTENING - Wild Animals 2
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(47, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice more wild animal vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen More Wild Animals', 11);

-- Session 3: SPEAKING - Wild Animals 2
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(48, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about more wild animals.', 3, 'SPEAKING', 'LOCK', 'Say More Wild Animals', 11);

-- Session 4: WORD_RECOGNITION - Wild Animals 2 (QUIZ)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(49, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What animal is it?', 4, 'WORD_RECOGNITION', 'LOCK', 'Wild Animal Quiz 2', 11);

-- Session Items for Session 49 (QUIZ)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(140, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+animal+is+it&type=2', 'What animal is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/frog.webp', 'QUIZ', 'frog', 'Nó là con vật gì?'),
	(575, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+animal+is+it&type=2', 'What animal is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hippo.webp', 'QUIZ', 'hippo', 'Nó là con vật gì?'),
	(576, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+animal+is+it&type=2', 'What animal is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/jellyfish.webp', 'QUIZ', 'jellyfish', 'Nó là con vật gì?'),
	(577, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+animal+is+it&type=2', 'What animal is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/lizard.webp', 'QUIZ', 'lizard', 'Nó là con vật gì?'),
	(578, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+animal+is+it&type=2', 'What animal is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/polar-bear.webp', 'QUIZ', 'polar bear', 'Nó là con vật gì?'),
	(579, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+animal+is+it&type=2', 'What animal is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/snake.webp', 'QUIZ', 'snake', 'Nó là con vật gì?'),
	(580, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+animal+is+it&type=2', 'What animal is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/spider.webp', 'QUIZ', 'spider', 'Nó là con vật gì?');

-- Session 5: GAMIFIED_REVIEW - Wild Animals 2 (FILL_IN_BLANK)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(50, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review more wild animal vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Wild Animal Adventure 2', 11);

-- Session Items for Session 50 (FILL_IN_BLANK)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(141, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+frog&type=2', 'It is a [frog].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/frog.webp', 'FILL_IN_BLANK', 'frog', 'Nó là một con ếch.'),
	(142, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+hippo&type=2', 'It is a [hippo].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hippo.webp', 'FILL_IN_BLANK', 'hippo', 'Nó là một con hà mã.'),
	(143, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+jellyfish&type=2', 'It is a [jellyfish].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/jellyfish.webp', 'FILL_IN_BLANK', 'jellyfish', 'Nó là một con sứa.'),
	(144, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+lizard&type=2', 'It is a [lizard].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/lizard.webp', 'FILL_IN_BLANK', 'lizard', 'Nó là một con thằn lằn.'),
	(145, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+polar+bear&type=2', 'It is a [polar bear].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/polar-bear.webp', 'FILL_IN_BLANK', 'polar bear', 'Nó là một con gấu Bắc Cực.'),
	(146, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+snake&type=2', 'It is a [snake].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/snake.webp', 'FILL_IN_BLANK', 'snake', 'Nó là một con rắn.'),
	(147, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+spider&type=2', 'It is a [spider].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/spider.webp', 'FILL_IN_BLANK', 'spider', 'Nó là một con nhện.');

-- =====================================================
-- TOPIC 5: CLOTHES
-- =====================================================
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`) VALUES
	(6, NOW(), NULL, b'0', NOW(), NULL, 'Learn about clothes and accessories.', 4, '/images/topics/clothes.png', 'CLOTHES', 3);

-- Part 1: Basic Clothes
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(12, NOW(), NULL, b'0', NOW(), NULL, 1, 'Basic Clothes', 6);

-- Session 1: INTRODUCTION - Basic Clothes (FLASHCARD with full sentences)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(51, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn basic clothes vocabulary.', 1, 'INTRODUCTION', 'LOCK', 'Basic Clothes', 12);

-- Session Items for Session 51 (FLASHCARD - full sentences)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(148, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+T-shirt&type=2', 'I\'m wearing a T-shirt.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/t-shirt.webp', 'FLASHCARD', 'T-shirt', 'Tôi đang mặc một cái áo thun.'),
	(149, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+shirt&type=2', 'I\'m wearing a shirt.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/shirt.webp', 'FLASHCARD', 'shirt', 'Tôi đang mặc một cái áo sơ mi.'),
	(150, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+trousers&type=2', 'I\'m wearing trousers.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/trousers.webp', 'FLASHCARD', 'trousers', 'Tôi đang mặc quần dài.'),
	(151, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+jeans&type=2', 'I\'m wearing jeans.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/jeans.webp', 'FLASHCARD', 'jeans', 'Tôi đang mặc quần jean.'),
	(152, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+shorts&type=2', 'I\'m wearing shorts.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/shorts.webp', 'FLASHCARD', 'shorts', 'Tôi đang mặc quần short.'),
	(153, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+skirt&type=2', 'I\'m wearing a skirt.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/skirt.webp', 'FLASHCARD', 'skirt', 'Tôi đang mặc một cái váy.'),
	(154, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+dress&type=2', 'I\'m wearing a dress.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/dress.webp', 'FLASHCARD', 'dress', 'Tôi đang mặc một cái đầm.'),
	(155, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+sock&type=2', 'I\'m wearing a sock.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/sock.webp', 'FLASHCARD', 'sock', 'Tôi đang mang một cái tất.'),
	(156, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+shoe&type=2', 'I\'m wearing a shoe.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/shoe.webp', 'FLASHCARD', 'shoe', 'Tôi đang mang một cái giày.'),
	(157, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+boots&type=2', 'I\'m wearing boots.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/boots.webp', 'FLASHCARD', 'boots', 'Tôi đang mang ủng.');

-- Session 2: LISTENING - Basic Clothes
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(52, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice clothes vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Clothes', 12);

-- Session 3: SPEAKING - Basic Clothes
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(53, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about clothes.', 3, 'SPEAKING', 'LOCK', 'Say Clothes', 12);

-- Session 4: WORD_RECOGNITION - Basic Clothes (QUIZ)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(54, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What are you wearing?', 4, 'WORD_RECOGNITION', 'LOCK', 'Clothes Quiz', 12);

-- Session Items for Session 54 (QUIZ)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(158, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/t-shirt.webp', 'QUIZ', 'T-shirt', 'Bạn đang mặc gì?'),
	(581, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/shirt.webp', 'QUIZ', 'shirt', 'Bạn đang mặc gì?'),
	(582, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/trousers.webp', 'QUIZ', 'trousers', 'Bạn đang mặc gì?'),
	(583, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/jeans.webp', 'QUIZ', 'jeans', 'Bạn đang mặc gì?'),
	(584, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/shorts.webp', 'QUIZ', 'shorts', 'Bạn đang mặc gì?'),
	(585, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/skirt.webp', 'QUIZ', 'skirt', 'Bạn đang mặc gì?'),
	(586, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/dress.webp', 'QUIZ', 'dress', 'Bạn đang mặc gì?'),
	(587, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/sock.webp', 'QUIZ', 'sock', 'Bạn đang mặc gì?'),
	(588, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/shoe.webp', 'QUIZ', 'shoe', 'Bạn đang mặc gì?'),
	(589, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/boots.webp', 'QUIZ', 'boots', 'Bạn đang mặc gì?');

-- Session 5: GAMIFIED_REVIEW - Basic Clothes (FILL_IN_BLANK)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(55, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review clothes vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Clothes Adventure', 12);

-- Session Items for Session 55 (FILL_IN_BLANK)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(159, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+T-shirt&type=2', 'I\'m wearing a [T-shirt].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/t-shirt.webp', 'FILL_IN_BLANK', 'T-shirt', 'Tôi đang mặc một cái áo thun.'),
	(160, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+shirt&type=2', 'I\'m wearing a [shirt].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/shirt.webp', 'FILL_IN_BLANK', 'shirt', 'Tôi đang mặc một cái áo sơ mi.'),
	(161, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+trousers&type=2', 'I\'m wearing [trousers].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/trousers.webp', 'FILL_IN_BLANK', 'trousers', 'Tôi đang mặc quần dài.'),
	(162, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+jeans&type=2', 'I\'m wearing [jeans].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/jeans.webp', 'FILL_IN_BLANK', 'jeans', 'Tôi đang mặc quần jean.'),
	(163, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+shorts&type=2', 'I\'m wearing [shorts].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/shorts.webp', 'FILL_IN_BLANK', 'shorts', 'Tôi đang mặc quần short.'),
	(164, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+skirt&type=2', 'I\'m wearing a [skirt].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/skirt.webp', 'FILL_IN_BLANK', 'skirt', 'Tôi đang mặc một cái váy.'),
	(165, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+dress&type=2', 'I\'m wearing a [dress].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/dress.webp', 'FILL_IN_BLANK', 'dress', 'Tôi đang mặc một cái đầm.'),
	(166, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+sock&type=2', 'I\'m wearing a [sock].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/sock.webp', 'FILL_IN_BLANK', 'sock', 'Tôi đang mang một cái tất.'),
	(167, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+shoe&type=2', 'I\'m wearing a [shoe].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/shoe.webp', 'FILL_IN_BLANK', 'shoe', 'Tôi đang mang một cái giày.'),
	(168, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+boots&type=2', 'I\'m wearing [boots].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/boots.webp', 'FILL_IN_BLANK', 'boots', 'Tôi đang mang ủng.');

-- Part 2: Accessories
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(13, NOW(), NULL, b'0', NOW(), NULL, 2, 'Accessories', 6);

-- Session 1: INTRODUCTION - Accessories (FLASHCARD with full sentences)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(56, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn accessories vocabulary.', 1, 'INTRODUCTION', 'LOCK', 'Accessories', 13);

-- Session Items for Session 56 (FLASHCARD - full sentences)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(169, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+hat&type=2', 'I\'m wearing a hat.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hat.webp', 'FLASHCARD', 'hat', 'Tôi đang đội một cái mũ.'),
	(170, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+jacket&type=2', 'I\'m wearing a jacket.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/jacket.webp', 'FLASHCARD', 'jacket', 'Tôi đang mặc một cái áo khoác.'),
	(171, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+bag&type=2', 'I\'m wearing a bag.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bag.webp', 'FLASHCARD', 'bag', 'Tôi đang đeo một cái túi.'),
	(172, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+handbag&type=2', 'I\'m wearing a handbag.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/handbag.webp', 'FLASHCARD', 'handbag', 'Tôi đang đeo một cái túi xách.'),
	(173, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+glasses&type=2', 'I\'m wearing glasses.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/glasses.webp', 'FLASHCARD', 'glasses', 'Tôi đang đeo kính mắt.'),
	(174, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+baseball+cap&type=2', 'I\'m wearing a baseball cap.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/baseball-cap.webp', 'FLASHCARD', 'baseball cap', 'Tôi đang đội một cái mũ lưỡi trai.'),
	(175, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+clothes&type=2', 'I\'m wearing clothes.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/clothes.webp', 'FLASHCARD', 'clothes', 'Tôi đang mặc quần áo.');

-- Session 2: LISTENING - Accessories
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(57, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice accessories vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Accessories', 13);

-- Session 3: SPEAKING - Accessories
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(58, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about accessories.', 3, 'SPEAKING', 'LOCK', 'Say Accessories', 13);

-- Session 4: WORD_RECOGNITION - Accessories (QUIZ)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(59, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What are you wearing?', 4, 'WORD_RECOGNITION', 'LOCK', 'Accessories Quiz', 13);

-- Session Items for Session 59 (QUIZ)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(176, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hat.webp', 'QUIZ', 'hat', 'Bạn đang mặc gì?'),
	(590, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/jacket.webp', 'QUIZ', 'jacket', 'Bạn đang mặc gì?'),
	(591, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bag.webp', 'QUIZ', 'bag', 'Bạn đang mặc gì?'),
	(592, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/handbag.webp', 'QUIZ', 'handbag', 'Bạn đang mặc gì?'),
	(593, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/glasses.webp', 'QUIZ', 'glasses', 'Bạn đang mặc gì?'),
	(594, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/baseball-cap.webp', 'QUIZ', 'baseball cap', 'Bạn đang mặc gì?'),
	(595, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/clothes.webp', 'QUIZ', 'clothes', 'Bạn đang mặc gì?');

-- Session 5: GAMIFIED_REVIEW - Accessories (FILL_IN_BLANK)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(60, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review accessories vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Accessories Adventure', 13);

-- Session Items for Session 60 (FILL_IN_BLANK)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(177, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+hat&type=2', 'I\'m wearing a [hat].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hat.webp', 'FILL_IN_BLANK', 'hat', 'Tôi đang đội một cái mũ.'),
	(178, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+jacket&type=2', 'I\'m wearing a [jacket].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/jacket.webp', 'FILL_IN_BLANK', 'jacket', 'Tôi đang mặc một cái áo khoác.'),
	(179, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+bag&type=2', 'I\'m wearing a [bag].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bag.webp', 'FILL_IN_BLANK', 'bag', 'Tôi đang đeo một cái túi.'),
	(180, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+handbag&type=2', 'I\'m wearing a [handbag].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/handbag.webp', 'FILL_IN_BLANK', 'handbag', 'Tôi đang đeo một cái túi xách.'),
	(181, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+glasses&type=2', 'I\'m wearing [glasses].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/glasses.webp', 'FILL_IN_BLANK', 'glasses', 'Tôi đang đeo kính mắt.'),
	(182, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+a+baseball+cap&type=2', 'I\'m wearing a [baseball cap].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/baseball-cap.webp', 'FILL_IN_BLANK', 'baseball cap', 'Tôi đang đội một cái mũ lưỡi trai.'),
	(183, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Im+wearing+clothes&type=2', 'I\'m wearing [clothes].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/clothes.webp', 'FILL_IN_BLANK', 'clothes', 'Tôi đang mặc quần áo.');

-- =====================================================
-- TOPIC 3: COLOURS
-- =====================================================
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`) VALUES
	(7, NOW(), NULL, b'0', NOW(), NULL, 'Learn about basic colors.', 5, '/images/topics/colors.png', 'COLOURS', 3);

-- Part 1: Basic Colours
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(14, NOW(), NULL, b'0', NOW(), NULL, 1, 'Basic Colours', 7);

-- Session 1: INTRODUCTION - Basic Colours (FLASHCARD with full sentences)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(61, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn basic colors.', 1, 'INTRODUCTION', 'LOCK', 'Basic Colours', 14);

-- Session Items for Session 61 (FLASHCARD - full sentences)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(184, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+black&type=2', 'The ball is black.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/black.webp', 'FLASHCARD', 'black', 'Quả bóng màu đen.'),
	(185, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+blue&type=2', 'The ball is blue.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/blue.webp', 'FLASHCARD', 'blue', 'Quả bóng màu xanh dương.'),
	(186, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+brown&type=2', 'The ball is brown.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/brown.webp', 'FLASHCARD', 'brown', 'Quả bóng màu nâu.'),
	(187, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+green&type=2', 'The ball is green.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/green.webp', 'FLASHCARD', 'green', 'Quả bóng màu xanh lá.'),
	(188, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+grey&type=2', 'The ball is grey.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/grey.webp', 'FLASHCARD', 'grey', 'Quả bóng màu xám.'),
	(189, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+orange&type=2', 'The ball is orange.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/orange.webp', 'FLASHCARD', 'orange', 'Quả bóng màu cam.'),
	(190, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+pink&type=2', 'The ball is pink.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/pink.webp', 'FLASHCARD', 'pink', 'Quả bóng màu hồng.'),
	(191, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+purple&type=2', 'The ball is purple.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/purple.webp', 'FLASHCARD', 'purple', 'Quả bóng màu tím.'),
	(192, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+red&type=2', 'The ball is red.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/red.webp', 'FLASHCARD', 'red', 'Quả bóng màu đỏ.'),
	(193, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+white&type=2', 'The ball is white.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/white.webp', 'FLASHCARD', 'white', 'Quả bóng màu trắng.'),
	(194, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+yellow&type=2', 'The ball is yellow.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/yellow.webp', 'FLASHCARD', 'yellow', 'Quả bóng màu vàng.');

-- Session 2: LISTENING - Basic Colours
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(62, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice color vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Colours', 14);

-- Session 3: SPEAKING - Basic Colours
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(63, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about colors.', 3, 'SPEAKING', 'LOCK', 'Say Colours', 14);

-- Session 4: WORD_RECOGNITION - Basic Colours (QUIZ)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(64, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What colour is the ball?', 4, 'WORD_RECOGNITION', 'LOCK', 'Colours Quiz', 14);

-- Session Items for Session 64 (QUIZ)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(195, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/black.webp', 'QUIZ', 'black', 'Quả bóng màu gì?'),
	(596, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/blue.webp', 'QUIZ', 'blue', 'Quả bóng màu gì?'),
	(597, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/brown.webp', 'QUIZ', 'brown', 'Quả bóng màu gì?'),
	(598, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/green.webp', 'QUIZ', 'green', 'Quả bóng màu gì?'),
	(599, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/grey.webp', 'QUIZ', 'grey', 'Quả bóng màu gì?'),
	(600, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/orange.webp', 'QUIZ', 'orange', 'Quả bóng màu gì?'),
	(601, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/pink.webp', 'QUIZ', 'pink', 'Quả bóng màu gì?'),
	(602, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/purple.webp', 'QUIZ', 'purple', 'Quả bóng màu gì?'),
	(603, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/red.webp', 'QUIZ', 'red', 'Quả bóng màu gì?'),
	(604, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/white.webp', 'QUIZ', 'white', 'Quả bóng màu gì?'),
	(605, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/yellow.webp', 'QUIZ', 'yellow', 'Quả bóng màu gì?');

-- Session 5: GAMIFIED_REVIEW - Basic Colours (FILL_IN_BLANK)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(65, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review color vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Colours Adventure', 14);

-- Session Items for Session 65 (FILL_IN_BLANK)
INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(196, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+black&type=2', 'The ball is [black].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/black.webp', 'FILL_IN_BLANK', 'black', 'Quả bóng màu đen.'),
	(197, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+blue&type=2', 'The ball is [blue].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/blue.webp', 'FILL_IN_BLANK', 'blue', 'Quả bóng màu xanh dương.'),
	(198, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+brown&type=2', 'The ball is [brown].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/brown.webp', 'FILL_IN_BLANK', 'brown', 'Quả bóng màu nâu.'),
	(199, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+green&type=2', 'The ball is [green].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/green.webp', 'FILL_IN_BLANK', 'green', 'Quả bóng màu xanh lá.'),
	(200, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+grey&type=2', 'The ball is [grey].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/grey.webp', 'FILL_IN_BLANK', 'grey', 'Quả bóng màu xám.'),
	(201, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+orange&type=2', 'The ball is [orange].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/orange.webp', 'FILL_IN_BLANK', 'orange', 'Quả bóng màu cam.'),
	(202, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+pink&type=2', 'The ball is [pink].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/pink.webp', 'FILL_IN_BLANK', 'pink', 'Quả bóng màu hồng.'),
	(203, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+purple&type=2', 'The ball is [purple].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/purple.webp', 'FILL_IN_BLANK', 'purple', 'Quả bóng màu tím.'),
	(204, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+red&type=2', 'The ball is [red].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/red.webp', 'FILL_IN_BLANK', 'red', 'Quả bóng màu đỏ.'),
	(205, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+white&type=2', 'The ball is [white].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/white.webp', 'FILL_IN_BLANK', 'white', 'Quả bóng màu trắng.'),
	(206, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=The+ball+is+yellow&type=2', 'The ball is [yellow].', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/yellow.webp', 'FILL_IN_BLANK', 'yellow', 'Quả bóng màu vàng.');

-- =====================================================
-- SESSION ITEM MAPPINGS
-- =====================================================
INSERT INTO `session_item_mappings` (`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `session_id`, `session_item_id`) VALUES
	-- Session 16 (INTRODUCTION - Body Part 1)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 16, 48),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 16, 49),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 16, 50),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 16, 51),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 16, 52),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 16, 53),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 16, 54),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 16, 55),
	-- Session 17 (LISTENING - Body Part 1)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 17, 48),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 17, 49),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 17, 50),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 17, 51),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 17, 52),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 17, 53),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 17, 54),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 17, 55),
	-- Session 18 (SPEAKING - Body Part 1)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 18, 48),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 18, 49),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 18, 50),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 18, 51),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 18, 52),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 18, 53),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 18, 54),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 18, 55),
	-- Session 19 (WORD_RECOGNITION - Body Part 1)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 19, 57),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 19, 542),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 19, 543),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 19, 544),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 19, 545),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 19, 546),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 19, 547),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 19, 548),
	-- Session 20 (GAMIFIED_REVIEW - Body Part 1)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 20, 58),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 20, 59),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 20, 60),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 20, 61),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 20, 62),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 20, 63),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 20, 64),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 20, 65),
	-- Session 21 (INTRODUCTION - Body Part 2)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 21, 66),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 21, 67),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 21, 68),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 21, 69),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 21, 70),
	-- Session 22 (LISTENING - Body Part 2)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 22, 66),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 22, 67),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 22, 68),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 22, 69),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 22, 70),
	-- Session 23 (SPEAKING - Body Part 2)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 23, 66),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 23, 67),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 23, 68),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 23, 69),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 23, 70),
	-- Session 24 (WORD_RECOGNITION - Body Part 2)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 24, 71),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 24, 549),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 24, 550),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 24, 551),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 24, 552),
	-- Session 25 (GAMIFIED_REVIEW - Body Part 2)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 25, 72),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 25, 73),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 25, 74),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 25, 75),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 25, 76),
	-- Session 26 (INTRODUCTION - Family)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 26, 77),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 26, 78),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 26, 79),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 26, 80),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 26, 81),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 26, 82),
	-- Session 27 (LISTENING - Family)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 27, 77),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 27, 78),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 27, 79),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 27, 80),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 27, 81),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 27, 82),
	-- Session 28 (SPEAKING - Family)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 28, 77),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 28, 78),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 28, 79),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 28, 80),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 28, 81),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 28, 82),
	-- Session 29 (WORD_RECOGNITION - Family)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 29, 83),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 29, 553),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 29, 554),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 29, 555),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 29, 556),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 29, 557),
	-- Session 30 (GAMIFIED_REVIEW - Family)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 30, 84),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 30, 85),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 30, 86),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 30, 87),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 30, 88),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 30, 89),
	-- Session 31 (INTRODUCTION - Pets)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 31, 90),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 31, 91),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 31, 92),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 31, 93),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 31, 94),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 31, 95),
	-- Session 32 (LISTENING - Pets)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 32, 90),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 32, 91),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 32, 92),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 32, 93),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 32, 94),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 32, 95),
	-- Session 33 (SPEAKING - Pets)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 33, 90),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 33, 91),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 33, 92),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 33, 93),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 33, 94),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 33, 95),
	-- Session 34 (WORD_RECOGNITION - Pets)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 34, 96),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 34, 558),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 34, 559),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 34, 560),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 34, 561),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 34, 562),
	-- Session 35 (GAMIFIED_REVIEW - Pets)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 35, 97),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 35, 98),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 35, 99),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 35, 100),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 35, 101),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 35, 102),
	-- Session 36 (INTRODUCTION - Farm Animals)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 36, 103),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 36, 104),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 36, 105),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 36, 106),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 36, 107),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 36, 108),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 36, 109),
	-- Session 37 (LISTENING - Farm Animals)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 37, 103),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 37, 104),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 37, 105),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 37, 106),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 37, 107),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 37, 108),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 37, 109),
	-- Session 38 (SPEAKING - Farm Animals)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 38, 103),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 38, 104),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 38, 105),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 38, 106),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 38, 107),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 38, 108),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 38, 109),
	-- Session 39 (WORD_RECOGNITION - Farm Animals)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 39, 110),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 39, 563),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 39, 564),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 39, 565),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 39, 566),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 39, 567),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 39, 568),
	-- Session 40 (GAMIFIED_REVIEW - Farm Animals)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 40, 111),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 40, 112),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 40, 113),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 40, 114),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 40, 115),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 40, 116),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 40, 117),
	-- Session 41 (INTRODUCTION - Wild Animals 1)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 41, 118),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 41, 119),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 41, 120),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 41, 121),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 41, 122),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 41, 123),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 41, 124),
	-- Session 42 (LISTENING - Wild Animals 1)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 42, 118),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 42, 119),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 42, 120),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 42, 121),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 42, 122),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 42, 123),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 42, 124),
	-- Session 43 (SPEAKING - Wild Animals 1)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 43, 118),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 43, 119),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 43, 120),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 43, 121),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 43, 122),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 43, 123),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 43, 124),
	-- Session 44 (WORD_RECOGNITION - Wild Animals 1)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 44, 125),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 44, 569),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 44, 570),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 44, 571),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 44, 572),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 44, 573),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 44, 574),
	-- Session 45 (GAMIFIED_REVIEW - Wild Animals 1)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 45, 126),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 45, 127),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 45, 128),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 45, 129),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 45, 130),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 45, 131),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 45, 132),
	-- Session 46 (INTRODUCTION - Wild Animals 2)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 46, 133),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 46, 134),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 46, 135),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 46, 136),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 46, 137),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 46, 138),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 46, 139),
	-- Session 47 (LISTENING - Wild Animals 2)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 47, 133),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 47, 134),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 47, 135),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 47, 136),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 47, 137),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 47, 138),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 47, 139),
	-- Session 48 (SPEAKING - Wild Animals 2)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 48, 133),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 48, 134),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 48, 135),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 48, 136),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 48, 137),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 48, 138),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 48, 139),
	-- Session 49 (WORD_RECOGNITION - Wild Animals 2)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 49, 140),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 49, 575),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 49, 576),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 49, 577),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 49, 578),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 49, 579),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 49, 580),
	-- Session 50 (GAMIFIED_REVIEW - Wild Animals 2)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 50, 141),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 50, 142),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 50, 143),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 50, 144),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 50, 145),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 50, 146),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 50, 147),
	-- Session 51 (INTRODUCTION - Basic Clothes)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 51, 148),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 51, 149),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 51, 150),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 51, 151),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 51, 152),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 51, 153),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 51, 154),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 51, 155),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 51, 156),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 51, 157),
	-- Session 52 (LISTENING - Basic Clothes)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 52, 148),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 52, 149),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 52, 150),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 52, 151),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 52, 152),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 52, 153),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 52, 154),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 52, 155),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 52, 156),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 52, 157),
	-- Session 53 (SPEAKING - Basic Clothes)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 53, 148),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 53, 149),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 53, 150),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 53, 151),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 53, 152),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 53, 153),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 53, 154),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 53, 155),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 53, 156),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 53, 157),
	-- Session 54 (WORD_RECOGNITION - Basic Clothes)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 54, 158),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 54, 581),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 54, 582),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 54, 583),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 54, 584),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 54, 585),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 54, 586),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 54, 587),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 54, 588),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 54, 589),
	-- Session 55 (GAMIFIED_REVIEW - Basic Clothes)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 55, 159),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 55, 160),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 55, 161),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 55, 162),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 55, 163),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 55, 164),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 55, 165),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 55, 166),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 55, 167),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 55, 168),
	-- Session 56 (INTRODUCTION - Accessories)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 56, 169),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 56, 170),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 56, 171),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 56, 172),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 56, 173),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 56, 174),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 56, 175),
	-- Session 57 (LISTENING - Accessories)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 57, 169),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 57, 170),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 57, 171),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 57, 172),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 57, 173),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 57, 174),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 57, 175),
	-- Session 58 (SPEAKING - Accessories)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 58, 169),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 58, 170),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 58, 171),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 58, 172),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 58, 173),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 58, 174),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 58, 175),
	-- Session 59 (WORD_RECOGNITION - Accessories)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 59, 176),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 59, 590),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 59, 591),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 59, 592),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 59, 593),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 59, 594),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 59, 595),
	-- Session 60 (GAMIFIED_REVIEW - Accessories)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 60, 177),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 60, 178),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 60, 179),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 60, 180),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 60, 181),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 60, 182),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 60, 183),
	-- Session 61 (INTRODUCTION - Colours)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 61, 184),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 61, 185),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 61, 186),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 61, 187),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 61, 188),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 61, 189),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 61, 190),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 61, 191),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 61, 192),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 61, 193),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 61, 194),
	-- Session 62 (LISTENING - Colours)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 62, 184),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 62, 185),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 62, 186),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 62, 187),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 62, 188),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 62, 189),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 62, 190),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 62, 191),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 62, 192),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 62, 193),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 62, 194),
	-- Session 63 (SPEAKING - Colours)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 63, 184),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 63, 185),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 63, 186),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 63, 187),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 63, 188),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 63, 189),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 63, 190),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 63, 191),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 63, 192),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 63, 193),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 63, 194),
	-- Session 64 (WORD_RECOGNITION - Colours)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 64, 195),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 64, 596),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 64, 597),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 64, 598),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 64, 599),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 64, 600),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 64, 601),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 64, 602),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 64, 603),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 64, 604),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 64, 605),
	-- Session 65 (GAMIFIED_REVIEW - Colours)
	(NOW(), NULL, b'0', NOW(), NULL, 1, 65, 196),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 65, 197),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 65, 198),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 65, 199),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 65, 200),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 65, 201),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 65, 202),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 65, 203),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 65, 204),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 65, 205),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 65, 206);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

/* END TOPIC 5*/
-- =====================================================
-- TOPIC 6: THE HOME (id = 8)
-- =====================================================
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`) VALUES
	(8, NOW(), NULL, b'0', NOW(), NULL, 'Learn about rooms, furniture and electronics at home.', 6, '/images/topics/home.png', 'THE HOME', 3);

-- Part 1: Rooms
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(15, NOW(), NULL, b'0', NOW(), NULL, 1, 'Rooms', 8);

-- Session 1: INTRODUCTION - Rooms (FLASHCARD)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(66, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn rooms vocabulary.', 1, 'INTRODUCTION', 'UNLOCK', 'Rooms in the Home', 15);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(207, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+house&type=2', 'I am in the house.', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'house', 'Tôi đang ở trong ngôi nhà.'),
	(208, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+flat&type=2', 'I am in the flat.', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'flat', 'Tôi đang ở trong căn hộ.'),
	(209, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+at+home&type=2', 'I am at home.', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'home', 'Tôi đang ở nhà.'),
	(210, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+kitchen&type=2', 'I am in the kitchen.', 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'kitchen', 'Tôi đang ở trong bếp.'),
	(211, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+bedroom&type=2', 'I am in the bedroom.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'bedroom', 'Tôi đang ở trong phòng ngủ.'),
	(212, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+bathroom&type=2', 'I am in the bathroom.', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'bathroom', 'Tôi đang ở trong phòng tắm.'),
	(213, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+living+room&type=2', 'I am in the living room.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'living room', 'Tôi đang ở trong phòng khách.'),
	(214, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+dining+room&type=2', 'I am in the dining room.', 'https://images.unsplash.com/photo-1556912173-3bb406ef31cc?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'dining room', 'Tôi đang ở trong phòng ăn.'),
	(215, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+hall&type=2', 'I am in the hall.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'hall', 'Tôi đang ở trong hành lang.'),
	(216, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+garden&type=2', 'I am in the garden.', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'garden', 'Tôi đang ở trong vườn.');

-- Session 2: LISTENING - Rooms
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(67, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice rooms vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Rooms', 15);

-- Session 3: SPEAKING - Rooms
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(68, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about rooms.', 3, 'SPEAKING', 'LOCK', 'Say Rooms', 15);

-- Session 4: WORD_RECOGNITION - Rooms (QUIZ)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(69, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: Where are you?', 4, 'WORD_RECOGNITION', 'LOCK', 'Rooms Quiz', 15);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(217, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Where+are+you&type=2', 'Where are you?', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'house', 'Bạn đang ở đâu?'),
	(606, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Where+are+you&type=2', 'Where are you?', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'flat', 'Bạn đang ở đâu?'),
	(607, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Where+are+you&type=2', 'Where are you?', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'home', 'Bạn đang ở đâu?'),
	(608, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Where+are+you&type=2', 'Where are you?', 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'kitchen', 'Bạn đang ở đâu?'),
	(609, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Where+are+you&type=2', 'Where are you?', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'bedroom', 'Bạn đang ở đâu?'),
	(610, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Where+are+you&type=2', 'Where are you?', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'bathroom', 'Bạn đang ở đâu?'),
	(611, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Where+are+you&type=2', 'Where are you?', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'living room', 'Bạn đang ở đâu?'),
	(612, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Where+are+you&type=2', 'Where are you?', 'https://images.unsplash.com/photo-1556912173-3bb406ef31cc?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'dining room', 'Bạn đang ở đâu?'),
	(613, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Where+are+you&type=2', 'Where are you?', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'hall', 'Bạn đang ở đâu?'),
	(614, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Where+are+you&type=2', 'Where are you?', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'garden', 'Bạn đang ở đâu?');

-- Session 5: GAMIFIED_REVIEW - Rooms (FILL_IN_BLANK)
INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(70, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review rooms vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Rooms Adventure', 15);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(218, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+house&type=2', 'I am in the [house].', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'house', 'Tôi đang ở trong ngôi nhà.'),
	(219, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+flat&type=2', 'I am in the [flat].', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'flat', 'Tôi đang ở trong căn hộ.'),
	(220, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+at+home&type=2', 'I am at [home].', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'home', 'Tôi đang ở nhà.'),
	(221, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+kitchen&type=2', 'I am in the [kitchen].', 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'kitchen', 'Tôi đang ở trong bếp.'),
	(222, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+bedroom&type=2', 'I am in the [bedroom].', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'bedroom', 'Tôi đang ở trong phòng ngủ.'),
	(223, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+bathroom&type=2', 'I am in the [bathroom].', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'bathroom', 'Tôi đang ở trong phòng tắm.'),
	(224, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+living+room&type=2', 'I am in the [living room].', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'living room', 'Tôi đang ở trong phòng khách.'),
	(225, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+dining+room&type=2', 'I am in the [dining room].', 'https://images.unsplash.com/photo-1556912173-3bb406ef31cc?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'dining room', 'Tôi đang ở trong phòng ăn.'),
	(226, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+hall&type=2', 'I am in the [hall].', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'hall', 'Tôi đang ở trong hành lang.'),
	(227, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+am+in+the+garden&type=2', 'I am in the [garden].', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'garden', 'Tôi đang ở trong vườn.');

-- Part 2: Furniture 1
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(16, NOW(), NULL, b'0', NOW(), NULL, 2, 'Furniture 1', 8);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(71, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn furniture vocabulary.', 1, 'INTRODUCTION', 'LOCK', 'Furniture 1', 16);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(228, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+table&type=2', 'There is a table.', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'table', 'Có một cái bàn.'),
	(229, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+chair&type=2', 'There is a chair.', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'chair', 'Có một cái ghế.'),
	(230, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+desk&type=2', 'There is a desk.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'desk', 'Có một cái bàn làm việc.'),
	(231, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+bed&type=2', 'There is a bed.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'bed', 'Có một cái giường.'),
	(232, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+sofa&type=2', 'There is a sofa.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'sofa', 'Có một cái ghế sofa.'),
	(233, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+an+armchair&type=2', 'There is an armchair.', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'armchair', 'Có một cái ghế bành.'),
	(234, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+bookcase&type=2', 'There is a bookcase.', 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'bookcase', 'Có một cái tủ sách.'),
	(235, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+cupboard&type=2', 'There is a cupboard.', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'cupboard', 'Có một cái tủ chạn.'),
	(236, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+mirror&type=2', 'There is a mirror.', 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'mirror', 'Có một cái gương.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(72, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice furniture vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Furniture 1', 16),
	(73, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about furniture.', 3, 'SPEAKING', 'LOCK', 'Say Furniture 1', 16),
	(74, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What is there?', 4, 'WORD_RECOGNITION', 'LOCK', 'Furniture Quiz 1', 16);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(237, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'table', 'Có gì ở đó?'),
	(615, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'chair', 'Có gì ở đó?'),
	(616, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'desk', 'Có gì ở đó?'),
	(617, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'bed', 'Có gì ở đó?'),
	(618, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'sofa', 'Có gì ở đó?'),
	(619, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'armchair', 'Có gì ở đó?'),
	(620, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'bookcase', 'Có gì ở đó?'),
	(621, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'cupboard', 'Có gì ở đó?'),
	(622, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'mirror', 'Có gì ở đó?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(75, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review furniture vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Furniture Adventure 1', 16);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(238, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+table&type=2', 'There is a [table].', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'table', 'Có một cái bàn.'),
	(239, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+chair&type=2', 'There is a [chair].', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'chair', 'Có một cái ghế.'),
	(240, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+desk&type=2', 'There is a [desk].', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'desk', 'Có một cái bàn làm việc.'),
	(241, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+bed&type=2', 'There is a [bed].', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'bed', 'Có một cái giường.'),
	(242, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+sofa&type=2', 'There is a [sofa].', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'sofa', 'Có một cái ghế sofa.'),
	(243, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+an+armchair&type=2', 'There is an [armchair].', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'armchair', 'Có một cái ghế bành.'),
	(244, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+bookcase&type=2', 'There is a [bookcase].', 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'bookcase', 'Có một cái tủ sách.'),
	(245, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+cupboard&type=2', 'There is a [cupboard].', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'cupboard', 'Có một cái tủ chạn.'),
	(246, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+mirror&type=2', 'There is a [mirror].', 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'mirror', 'Có một cái gương.');

-- Part 3: Furniture 2
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(17, NOW(), NULL, b'0', NOW(), NULL, 3, 'Furniture 2', 8);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(76, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn more furniture vocabulary.', 1, 'INTRODUCTION', 'LOCK', 'Furniture 2', 17);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(247, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+lamp&type=2', 'There is a lamp.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'lamp', 'Có một cái đèn.'),
	(248, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+picture&type=2', 'There is a picture.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'picture', 'Có một bức tranh.'),
	(249, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+mat&type=2', 'There is a mat.', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'mat', 'Có một cái thảm nhỏ.'),
	(250, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+rug&type=2', 'There is a rug.', 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'rug', 'Có một cái thảm.'),
	(251, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+box&type=2', 'There is a box.', 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'box', 'Có một cái hộp.'),
	(252, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+door&type=2', 'There is a door.', 'https://images.unsplash.com/photo-1527004013197-933c4bb61b96?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'door', 'Có một cái cửa.'),
	(253, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+window&type=2', 'There is a window.', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'window', 'Có một cái cửa sổ.'),
	(254, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+wall&type=2', 'There is a wall.', 'https://images.unsplash.com/photo-1527004013197-933c4bb61b96?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'wall', 'Có một bức tường.'),
	(255, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+bath&type=2', 'There is a bath.', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'bath', 'Có một cái bồn tắm.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(77, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice more furniture vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Furniture 2', 17),
	(78, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about more furniture.', 3, 'SPEAKING', 'LOCK', 'Say Furniture 2', 17),
	(79, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What is there?', 4, 'WORD_RECOGNITION', 'LOCK', 'Furniture Quiz 2', 17);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(256, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'lamp', 'Có gì ở đó?'),
	(623, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'picture', 'Có gì ở đó?'),
	(624, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'mat', 'Có gì ở đó?'),
	(625, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'rug', 'Có gì ở đó?'),
	(626, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'box', 'Có gì ở đó?'),
	(627, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1527004013197-933c4bb61b96?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'door', 'Có gì ở đó?'),
	(628, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'window', 'Có gì ở đó?'),
	(629, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1527004013197-933c4bb61b96?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'wall', 'Có gì ở đó?'),
	(630, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+there&type=2', 'What is there?', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'bath', 'Có gì ở đó?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(80, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review more furniture vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Furniture Adventure 2', 17);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(257, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+lamp&type=2', 'There is a [lamp].', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'lamp', 'Có một cái đèn.'),
	(258, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+picture&type=2', 'There is a [picture].', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'picture', 'Có một bức tranh.'),
	(259, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+mat&type=2', 'There is a [mat].', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'mat', 'Có một cái thảm nhỏ.'),
	(260, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+rug&type=2', 'There is a [rug].', 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'rug', 'Có một cái thảm.'),
	(261, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+box&type=2', 'There is a [box].', 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'box', 'Có một cái hộp.'),
	(262, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+door&type=2', 'There is a [door].', 'https://images.unsplash.com/photo-1527004013197-933c4bb61b96?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'door', 'Có một cái cửa.'),
	(263, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+window&type=2', 'There is a [window].', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'window', 'Có một cái cửa sổ.'),
	(264, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+wall&type=2', 'There is a [wall].', 'https://images.unsplash.com/photo-1527004013197-933c4bb61b96?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'wall', 'Có một bức tường.'),
	(265, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+a+bath&type=2', 'There is a [bath].', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'bath', 'Có một cái bồn tắm.');

-- Part 4: Electronics
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(18, NOW(), NULL, b'0', NOW(), NULL, 4, 'Electronics', 8);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(81, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn electronics vocabulary.', 1, 'INTRODUCTION', 'LOCK', 'Electronics', 18);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(266, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+television&type=2', 'It is a television.', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'television', 'Nó là một cái tivi.'),
	(267, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+computer&type=2', 'It is a computer.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'computer', 'Nó là một cái máy tính.'),
	(268, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+phone&type=2', 'It is a phone.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'phone', 'Nó là một cái điện thoại.'),
	(269, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+radio&type=2', 'It is a radio.', 'https://images.unsplash.com/photo-1508700115895-45b8c6e1a489?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'radio', 'Nó là một cái radio.'),
	(270, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+camera&type=2', 'It is a camera.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'camera', 'Nó là một cái máy ảnh.'),
	(271, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+watch&type=2', 'It is a watch.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'watch', 'Nó là một cái đồng hồ đeo tay.'),
	(272, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+clock&type=2', 'It is a clock.', 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'clock', 'Nó là một cái đồng hồ treo tường.'),
	(273, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+toy&type=2', 'It is a toy.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'toy', 'Nó là một món đồ chơi.'),
	(274, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+doll&type=2', 'It is a doll.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'doll', 'Nó là một con búp bê.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(82, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice electronics vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Electronics', 18),
	(83, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about electronics.', 3, 'SPEAKING', 'LOCK', 'Say Electronics', 18),
	(84, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What is it?', 4, 'WORD_RECOGNITION', 'LOCK', 'Electronics Quiz', 18);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(275, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'television', 'Nó là gì?'),
	(631, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'computer', 'Nó là gì?'),
	(632, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'phone', 'Nó là gì?'),
	(633, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://images.unsplash.com/photo-1508700115895-45b8c6e1a489?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'radio', 'Nó là gì?'),
	(634, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'camera', 'Nó là gì?'),
	(635, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'watch', 'Nó là gì?'),
	(636, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'clock', 'Nó là gì?'),
	(637, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'toy', 'Nó là gì?'),
	(638, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'doll', 'Nó là gì?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(85, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review electronics vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Electronics Adventure', 18);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(276, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+television&type=2', 'It is a [television].', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'television', 'Nó là một cái tivi.'),
	(277, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+computer&type=2', 'It is a [computer].', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'computer', 'Nó là một cái máy tính.'),
	(278, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+phone&type=2', 'It is a [phone].', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'phone', 'Nó là một cái điện thoại.'),
	(279, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+radio&type=2', 'It is a [radio].', 'https://images.unsplash.com/photo-1508700115895-45b8c6e1a489?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'radio', 'Nó là một cái radio.'),
	(280, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+camera&type=2', 'It is a [camera].', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'camera', 'Nó là một cái máy ảnh.'),
	(281, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+watch&type=2', 'It is a [watch].', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'watch', 'Nó là một cái đồng hồ đeo tay.'),
	(282, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+clock&type=2', 'It is a [clock].', 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'clock', 'Nó là một cái đồng hồ treo tường.'),
	(283, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+toy&type=2', 'It is a [toy].', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'toy', 'Nó là một món đồ chơi.'),
	(284, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=It+is+a+doll&type=2', 'It is a [doll].', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'doll', 'Nó là một con búp bê.');

-- =====================================================
-- TOPIC 7: NUMBERS (id = 9)
-- =====================================================
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`) VALUES
	(9, NOW(), NULL, b'0', NOW(), NULL, 'Learn numbers from 1 to 20.', 7, '/images/topics/numbers.png', 'NUMBERS', 3);

-- Part 1: 1-10
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(19, NOW(), NULL, b'0', NOW(), NULL, 1, 'Numbers 1-10', 9);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(86, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn numbers 1 to 10.', 1, 'INTRODUCTION', 'UNLOCK', 'Numbers 1-10', 19);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(285, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+one+ball&type=2', 'There is one ball.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'one', 'Có một quả bóng.'),
	(286, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+two+balls&type=2', 'There are two balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'two', 'Có hai quả bóng.'),
	(287, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+three+balls&type=2', 'There are three balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'three', 'Có ba quả bóng.'),
	(288, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+four+balls&type=2', 'There are four balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'four', 'Có bốn quả bóng.'),
	(289, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+five+balls&type=2', 'There are five balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'five', 'Có năm quả bóng.'),
	(290, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+six+balls&type=2', 'There are six balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'six', 'Có sáu quả bóng.'),
	(291, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+seven+balls&type=2', 'There are seven balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'seven', 'Có bảy quả bóng.'),
	(292, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+eight+balls&type=2', 'There are eight balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'eight', 'Có tám quả bóng.'),
	(293, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+nine+balls&type=2', 'There are nine balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'nine', 'Có chín quả bóng.'),
	(294, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+ten+balls&type=2', 'There are ten balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'ten', 'Có mười quả bóng.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(87, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice numbers 1-10.', 2, 'LISTENING', 'LOCK', 'Listen to Numbers 1-10', 19),
	(88, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking numbers 1-10.', 3, 'SPEAKING', 'LOCK', 'Say Numbers 1-10', 19),
	(89, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: How many balls are there?', 4, 'WORD_RECOGNITION', 'LOCK', 'Numbers Quiz 1-10', 19);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(295, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+balls+are+there&type=2', 'How many balls are there?', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'one', 'Có bao nhiêu quả bóng?'),
	(639, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+balls+are+there&type=2', 'How many balls are there?', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'two', 'Có bao nhiêu quả bóng?'),
	(640, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+balls+are+there&type=2', 'How many balls are there?', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'three', 'Có bao nhiêu quả bóng?'),
	(641, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+balls+are+there&type=2', 'How many balls are there?', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'four', 'Có bao nhiêu quả bóng?'),
	(642, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+balls+are+there&type=2', 'How many balls are there?', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'five', 'Có bao nhiêu quả bóng?'),
	(643, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+balls+are+there&type=2', 'How many balls are there?', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'six', 'Có bao nhiêu quả bóng?'),
	(644, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+balls+are+there&type=2', 'How many balls are there?', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'seven', 'Có bao nhiêu quả bóng?'),
	(645, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+balls+are+there&type=2', 'How many balls are there?', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'eight', 'Có bao nhiêu quả bóng?'),
	(646, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+balls+are+there&type=2', 'How many balls are there?', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'nine', 'Có bao nhiêu quả bóng?'),
	(647, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+balls+are+there&type=2', 'How many balls are there?', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'ten', 'Có bao nhiêu quả bóng?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(90, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review numbers 1-10 with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Numbers Adventure 1-10', 19);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(296, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+is+one+ball&type=2', 'There is [one] ball.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'one', 'Có một quả bóng.'),
	(297, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+two+balls&type=2', 'There are [two] balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'two', 'Có hai quả bóng.'),
	(298, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+three+balls&type=2', 'There are [three] balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'three', 'Có ba quả bóng.'),
	(299, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+four+balls&type=2', 'There are [four] balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'four', 'Có bốn quả bóng.'),
	(300, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+five+balls&type=2', 'There are [five] balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'five', 'Có năm quả bóng.'),
	(301, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+six+balls&type=2', 'There are [six] balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'six', 'Có sáu quả bóng.'),
	(302, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+seven+balls&type=2', 'There are [seven] balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'seven', 'Có bảy quả bóng.'),
	(303, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+eight+balls&type=2', 'There are [eight] balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'eight', 'Có tám quả bóng.'),
	(304, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+nine+balls&type=2', 'There are [nine] balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'nine', 'Có chín quả bóng.'),
	(305, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=There+are+ten+balls&type=2', 'There are [ten] balls.', 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'ten', 'Có mười quả bóng.');

-- Part 2: 11-20
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(20, NOW(), NULL, b'0', NOW(), NULL, 2, 'Numbers 11-20', 9);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(91, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn numbers 11 to 20.', 1, 'INTRODUCTION', 'LOCK', 'Numbers 11-20', 20);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(306, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+eleven+apples&type=2', 'I see eleven apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'eleven', 'Tôi nhìn thấy mười một quả táo.'),
	(307, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+twelve+apples&type=2', 'I see twelve apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'twelve', 'Tôi nhìn thấy mười hai quả táo.'),
	(308, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+thirteen+apples&type=2', 'I see thirteen apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'thirteen', 'Tôi nhìn thấy mười ba quả táo.'),
	(309, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+fourteen+apples&type=2', 'I see fourteen apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'fourteen', 'Tôi nhìn thấy mười bốn quả táo.'),
	(310, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+fifteen+apples&type=2', 'I see fifteen apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'fifteen', 'Tôi nhìn thấy mười lăm quả táo.'),
	(311, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+sixteen+apples&type=2', 'I see sixteen apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'sixteen', 'Tôi nhìn thấy mười sáu quả táo.'),
	(312, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+seventeen+apples&type=2', 'I see seventeen apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'seventeen', 'Tôi nhìn thấy mười bảy quả táo.'),
	(313, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+eighteen+apples&type=2', 'I see eighteen apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'eighteen', 'Tôi nhìn thấy mười tám quả táo.'),
	(314, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+nineteen+apples&type=2', 'I see nineteen apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'nineteen', 'Tôi nhìn thấy mười chín quả táo.'),
	(315, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+twenty+apples&type=2', 'I see twenty apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'twenty', 'Tôi nhìn thấy hai mươi quả táo.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(92, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice numbers 11-20.', 2, 'LISTENING', 'LOCK', 'Listen to Numbers 11-20', 20),
	(93, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking numbers 11-20.', 3, 'SPEAKING', 'LOCK', 'Say Numbers 11-20', 20),
	(94, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: How many apples can you see?', 4, 'WORD_RECOGNITION', 'LOCK', 'Numbers Quiz 11-20', 20);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(316, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+apples+can+you+see&type=2', 'How many apples can you see?', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'eleven', 'Bạn có thể nhìn thấy bao nhiêu quả táo?'),
	(648, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+apples+can+you+see&type=2', 'How many apples can you see?', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'twelve', 'Bạn có thể nhìn thấy bao nhiêu quả táo?'),
	(649, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+apples+can+you+see&type=2', 'How many apples can you see?', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'thirteen', 'Bạn có thể nhìn thấy bao nhiêu quả táo?'),
	(650, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+apples+can+you+see&type=2', 'How many apples can you see?', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'fourteen', 'Bạn có thể nhìn thấy bao nhiêu quả táo?'),
	(651, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+apples+can+you+see&type=2', 'How many apples can you see?', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'fifteen', 'Bạn có thể nhìn thấy bao nhiêu quả táo?'),
	(652, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+apples+can+you+see&type=2', 'How many apples can you see?', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'sixteen', 'Bạn có thể nhìn thấy bao nhiêu quả táo?'),
	(653, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+apples+can+you+see&type=2', 'How many apples can you see?', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'seventeen', 'Bạn có thể nhìn thấy bao nhiêu quả táo?'),
	(654, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+apples+can+you+see&type=2', 'How many apples can you see?', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'eighteen', 'Bạn có thể nhìn thấy bao nhiêu quả táo?'),
	(655, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+apples+can+you+see&type=2', 'How many apples can you see?', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'nineteen', 'Bạn có thể nhìn thấy bao nhiêu quả táo?'),
	(656, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+many+apples+can+you+see&type=2', 'How many apples can you see?', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'twenty', 'Bạn có thể nhìn thấy bao nhiêu quả táo?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(95, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review numbers 11-20 with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Numbers Adventure 11-20', 20);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(317, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+eleven+apples&type=2', 'I see [eleven] apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'eleven', 'Tôi nhìn thấy mười một quả táo.'),
	(318, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+twelve+apples&type=2', 'I see [twelve] apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'twelve', 'Tôi nhìn thấy mười hai quả táo.'),
	(319, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+thirteen+apples&type=2', 'I see [thirteen] apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'thirteen', 'Tôi nhìn thấy mười ba quả táo.'),
	(320, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+fourteen+apples&type=2', 'I see [fourteen] apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'fourteen', 'Tôi nhìn thấy mười bốn quả táo.'),
	(321, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+fifteen+apples&type=2', 'I see [fifteen] apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'fifteen', 'Tôi nhìn thấy mười lăm quả táo.'),
	(322, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+sixteen+apples&type=2', 'I see [sixteen] apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'sixteen', 'Tôi nhìn thấy mười sáu quả táo.'),
	(323, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+seventeen+apples&type=2', 'I see [seventeen] apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'seventeen', 'Tôi nhìn thấy mười bảy quả táo.'),
	(324, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+eighteen+apples&type=2', 'I see [eighteen] apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'eighteen', 'Tôi nhìn thấy mười tám quả táo.'),
	(325, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+nineteen+apples&type=2', 'I see [nineteen] apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'nineteen', 'Tôi nhìn thấy mười chín quả táo.'),
	(326, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+see+twenty+apples&type=2', 'I see [twenty] apples.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'twenty', 'Tôi nhìn thấy hai mươi quả táo.');

-- =====================================================
-- TOPIC 8: FOOD & DRINK (id = 10)
-- =====================================================
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`) VALUES
	(10, NOW(), NULL, b'0', NOW(), NULL, 'Learn about food and drink.', 8, '/images/topics/food.png', 'FOOD & DRINK', 3);

-- Part 1: Fruit 1
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(21, NOW(), NULL, b'0', NOW(), NULL, 1, 'Fruit 1', 10);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(96, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn fruit vocabulary.', 1, 'INTRODUCTION', 'UNLOCK', 'Fruit 1', 21);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(327, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+an+apple&type=2', 'I eat an apple.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'apple', 'Tôi ăn một quả táo.'),
	(328, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+banana&type=2', 'I eat a banana.', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'banana', 'Tôi ăn một quả chuối.'),
	(329, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+an+orange&type=2', 'I eat an orange.', 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'orange', 'Tôi ăn một quả cam.'),
	(330, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+lemon&type=2', 'I eat a lemon.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'lemon', 'Tôi ăn một quả chanh.'),
	(331, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+grape&type=2', 'I eat a grape.', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'grape', 'Tôi ăn một quả nho.'),
	(332, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+pear&type=2', 'I eat a pear.', 'https://images.unsplash.com/photo-1513651868280-f07fe54e1d58?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'pear', 'Tôi ăn một quả lê.'),
	(333, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+mango&type=2', 'I eat a mango.', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'mango', 'Tôi ăn một quả xoài.'),
	(334, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+pineapple&type=2', 'I eat a pineapple.', 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'pineapple', 'Tôi ăn một quả dứa.'),
	(335, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+watermelon&type=2', 'I eat a watermelon.', 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'watermelon', 'Tôi ăn một quả dưa hấu.'),
	(336, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+coconut&type=2', 'I eat a coconut.', 'https://images.unsplash.com/photo-1566872430476-8f025f9e3c9d?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'coconut', 'Tôi ăn một quả dừa.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(97, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice fruit vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Fruit 1', 21),
	(98, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about fruit.', 3, 'SPEAKING', 'LOCK', 'Say Fruit 1', 21),
	(99, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What fruit do you eat?', 4, 'WORD_RECOGNITION', 'LOCK', 'Fruit Quiz 1', 21);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(337, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+fruit+do+you+eat&type=2', 'What fruit do you eat?', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'apple', 'Bạn ăn trái cây gì?'),
	(657, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+fruit+do+you+eat&type=2', 'What fruit do you eat?', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'banana', 'Bạn ăn trái cây gì?'),
	(658, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+fruit+do+you+eat&type=2', 'What fruit do you eat?', 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'orange', 'Bạn ăn trái cây gì?'),
	(659, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+fruit+do+you+eat&type=2', 'What fruit do you eat?', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'lemon', 'Bạn ăn trái cây gì?'),
	(660, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+fruit+do+you+eat&type=2', 'What fruit do you eat?', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'grape', 'Bạn ăn trái cây gì?'),
	(661, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+fruit+do+you+eat&type=2', 'What fruit do you eat?', 'https://images.unsplash.com/photo-1513651868280-f07fe54e1d58?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'pear', 'Bạn ăn trái cây gì?'),
	(662, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+fruit+do+you+eat&type=2', 'What fruit do you eat?', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'mango', 'Bạn ăn trái cây gì?'),
	(663, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+fruit+do+you+eat&type=2', 'What fruit do you eat?', 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'pineapple', 'Bạn ăn trái cây gì?'),
	(664, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+fruit+do+you+eat&type=2', 'What fruit do you eat?', 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'watermelon', 'Bạn ăn trái cây gì?'),
	(665, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+fruit+do+you+eat&type=2', 'What fruit do you eat?', 'https://images.unsplash.com/photo-1566872430476-8f025f9e3c9d?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'coconut', 'Bạn ăn trái cây gì?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(100, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review fruit vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Fruit Adventure 1', 21);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(338, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+an+apple&type=2', 'I eat an [apple].', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'apple', 'Tôi ăn một quả táo.'),
	(339, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+banana&type=2', 'I eat a [banana].', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'banana', 'Tôi ăn một quả chuối.'),
	(340, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+an+orange&type=2', 'I eat an [orange].', 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'orange', 'Tôi ăn một quả cam.'),
	(341, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+lemon&type=2', 'I eat a [lemon].', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'lemon', 'Tôi ăn một quả chanh.'),
	(342, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+grape&type=2', 'I eat a [grape].', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'grape', 'Tôi ăn một quả nho.'),
	(343, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+pear&type=2', 'I eat a [pear].', 'https://images.unsplash.com/photo-1513651868280-f07fe54e1d58?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'pear', 'Tôi ăn một quả lê.'),
	(344, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+mango&type=2', 'I eat a [mango].', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'mango', 'Tôi ăn một quả xoài.'),
	(345, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+pineapple&type=2', 'I eat a [pineapple].', 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'pineapple', 'Tôi ăn một quả dứa.'),
	(346, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+watermelon&type=2', 'I eat a [watermelon].', 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'watermelon', 'Tôi ăn một quả dưa hấu.'),
	(347, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+coconut&type=2', 'I eat a [coconut].', 'https://images.unsplash.com/photo-1566872430476-8f025f9e3c9d?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'coconut', 'Tôi ăn một quả dừa.');

-- Part 2: Fruit 2 & Vegetables
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(22, NOW(), NULL, b'0', NOW(), NULL, 2, 'Fruit 2 & Vegetables', 10);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(101, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn more fruit and vegetables.', 1, 'INTRODUCTION', 'LOCK', 'Fruit 2 & Vegetables', 22);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(348, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+kiwi&type=2', 'I would like a kiwi.', 'https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'kiwi', 'Tôi muốn một quả kiwi.'),
	(349, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+lime&type=2', 'I would like a lime.', 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'lime', 'Tôi muốn một quả chanh xanh.'),
	(350, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+tomato&type=2', 'I would like a tomato.', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'tomato', 'Tôi muốn một quả cà chua.'),
	(351, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+carrot&type=2', 'I would like a carrot.', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'carrot', 'Tôi muốn một củ cà rốt.'),
	(352, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+an+onion&type=2', 'I would like an onion.', 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'onion', 'Tôi muốn một củ hành.'),
	(353, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+pea&type=2', 'I would like a pea.', 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'pea', 'Tôi muốn một hạt đậu.'),
	(354, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+bean&type=2', 'I would like a bean.', 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'bean', 'Tôi muốn một hạt đậu.'),
	(355, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+potato&type=2', 'I would like a potato.', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'potato', 'Tôi muốn một củ khoai tây.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(102, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice fruit and vegetable vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Fruit 2 & Vegetables', 22),
	(103, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about fruit and vegetables.', 3, 'SPEAKING', 'LOCK', 'Say Fruit 2 & Vegetables', 22),
	(104, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What would you like?', 4, 'WORD_RECOGNITION', 'LOCK', 'Fruit & Veg Quiz', 22);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(356, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+would+you+like&type=2', 'What would you like?', 'https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'kiwi', 'Bạn muốn gì?'),
	(666, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+would+you+like&type=2', 'What would you like?', 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'lime', 'Bạn muốn gì?'),
	(667, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+would+you+like&type=2', 'What would you like?', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'tomato', 'Bạn muốn gì?'),
	(668, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+would+you+like&type=2', 'What would you like?', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'carrot', 'Bạn muốn gì?'),
	(669, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+would+you+like&type=2', 'What would you like?', 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'onion', 'Bạn muốn gì?'),
	(670, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+would+you+like&type=2', 'What would you like?', 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'pea', 'Bạn muốn gì?'),
	(671, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+would+you+like&type=2', 'What would you like?', 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'bean', 'Bạn muốn gì?'),
	(672, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+would+you+like&type=2', 'What would you like?', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'potato', 'Bạn muốn gì?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(105, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review fruit and vegetable vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Fruit & Veg Adventure', 22);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(357, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+kiwi&type=2', 'I would like a [kiwi].', 'https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'kiwi', 'Tôi muốn một quả kiwi.'),
	(358, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+lime&type=2', 'I would like a [lime].', 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'lime', 'Tôi muốn một quả chanh xanh.'),
	(359, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+tomato&type=2', 'I would like a [tomato].', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'tomato', 'Tôi muốn một quả cà chua.'),
	(360, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+carrot&type=2', 'I would like a [carrot].', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'carrot', 'Tôi muốn một củ cà rốt.'),
	(361, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+an+onion&type=2', 'I would like an [onion].', 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'onion', 'Tôi muốn một củ hành.'),
	(362, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+pea&type=2', 'I would like a [pea].', 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'pea', 'Tôi muốn một hạt đậu.'),
	(363, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+bean&type=2', 'I would like a [bean].', 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'bean', 'Tôi muốn một hạt đậu.'),
	(364, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+would+like+a+potato&type=2', 'I would like a [potato].', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'potato', 'Tôi muốn một củ khoai tây.');

-- Part 3: Meals & Meat
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(23, NOW(), NULL, b'0', NOW(), NULL, 3, 'Meals & Meat', 10);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(106, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn meals and meat vocabulary.', 1, 'INTRODUCTION', 'LOCK', 'Meals & Meat', 23);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(365, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+bread+for+breakfast&type=2', 'I eat bread for breakfast.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'breakfast', 'Tôi ăn bánh mì vào bữa sáng.'),
	(366, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+an+egg+for+breakfast&type=2', 'I eat an egg for breakfast.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'egg', 'Tôi ăn một quả trứng vào bữa sáng.'),
	(367, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+sausage+for+breakfast&type=2', 'I eat a sausage for breakfast.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'sausage', 'Tôi ăn một cây xúc xích vào bữa sáng.'),
	(368, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+rice+for+lunch&type=2', 'I eat rice for lunch.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'lunch', 'Tôi ăn cơm vào bữa trưa.'),
	(369, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+burger+for+lunch&type=2', 'I eat a burger for lunch.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'burger', 'Tôi ăn một cái bánh burger vào bữa trưa.'),
	(370, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+pizza+for+lunch&type=2', 'I eat pizza for lunch.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'pizza', 'Tôi ăn pizza vào bữa trưa.'),
	(371, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+fish+for+lunch&type=2', 'I eat fish for lunch.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'fish', 'Tôi ăn cá vào bữa trưa.'),
	(372, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+meat+for+dinner&type=2', 'I eat meat for dinner.', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'dinner', 'Tôi ăn thịt vào bữa tối.'),
	(373, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+meatballs+for+dinner&type=2', 'I eat meatballs for dinner.', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'meatballs', 'Tôi ăn thịt viên vào bữa tối.'),
	(374, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+chicken+for+dinner&type=2', 'I eat chicken for dinner.', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'chicken', 'Tôi ăn thịt gà vào bữa tối.'),
	(375, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+pie+for+dinner&type=2', 'I eat a pie for dinner.', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'pie', 'Tôi ăn một cái bánh nướng vào bữa tối.'),
	(376, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+bread&type=2', 'I eat bread.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'bread', 'Tôi ăn bánh mì.'),
	(377, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+rice&type=2', 'I eat rice.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'rice', 'Tôi ăn cơm.'),
	(378, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+meat&type=2', 'I eat meat.', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'meat', 'Tôi ăn thịt.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(107, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice meals and meat vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Meals & Meat', 23),
	(108, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about meals and meat.', 3, 'SPEAKING', 'LOCK', 'Say Meals & Meat', 23),
	(109, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What do you eat for breakfast?', 4, 'WORD_RECOGNITION', 'LOCK', 'Meals Quiz', 23);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(379, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'bread', 'Bạn ăn gì vào bữa sáng?'),
	(673, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'breakfast', 'Bạn ăn gì vào bữa sáng?'),
	(674, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'egg', 'Bạn ăn gì vào bữa sáng?'),
	(675, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'sausage', 'Bạn ăn gì vào bữa sáng?'),
	(676, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'lunch', 'Bạn ăn gì vào bữa sáng?'),
	(677, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'burger', 'Bạn ăn gì vào bữa sáng?'),
	(678, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'pizza', 'Bạn ăn gì vào bữa sáng?'),
	(679, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'fish', 'Bạn ăn gì vào bữa sáng?'),
	(680, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'dinner', 'Bạn ăn gì vào bữa sáng?'),
	(681, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'meatballs', 'Bạn ăn gì vào bữa sáng?'),
	(682, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'chicken', 'Bạn ăn gì vào bữa sáng?'),
	(683, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'pie', 'Bạn ăn gì vào bữa sáng?'),
	(684, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'rice', 'Bạn ăn gì vào bữa sáng?'),
	(685, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+eat+for+breakfast&type=2', 'What do you eat for breakfast?', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'meat', 'Bạn ăn gì vào bữa sáng?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(110, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review meals and meat vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Meals Adventure', 23);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(380, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+bread+for+breakfast&type=2', 'I eat bread for [breakfast].', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'breakfast', 'Tôi ăn bánh mì vào bữa sáng.'),
	(381, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+an+egg+for+breakfast&type=2', 'I eat an [egg] for breakfast.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'egg', 'Tôi ăn một quả trứng vào bữa sáng.'),
	(382, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+sausage+for+breakfast&type=2', 'I eat a [sausage] for breakfast.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'sausage', 'Tôi ăn một cây xúc xích vào bữa sáng.'),
	(383, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+rice+for+lunch&type=2', 'I eat rice for [lunch].', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'lunch', 'Tôi ăn cơm vào bữa trưa.'),
	(384, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+burger+for+lunch&type=2', 'I eat a [burger] for lunch.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'burger', 'Tôi ăn một cái bánh burger vào bữa trưa.'),
	(385, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+pizza+for+lunch&type=2', 'I eat [pizza] for lunch.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'pizza', 'Tôi ăn pizza vào bữa trưa.'),
	(386, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+fish+for+lunch&type=2', 'I eat [fish] for lunch.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'fish', 'Tôi ăn cá vào bữa trưa.'),
	(387, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+meat+for+dinner&type=2', 'I eat meat for [dinner].', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'dinner', 'Tôi ăn thịt vào bữa tối.'),
	(388, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+meatballs+for+dinner&type=2', 'I eat [meatballs] for dinner.', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'meatballs', 'Tôi ăn thịt viên vào bữa tối.'),
	(389, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+chicken+for+dinner&type=2', 'I eat [chicken] for dinner.', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'chicken', 'Tôi ăn thịt gà vào bữa tối.'),
	(390, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+a+pie+for+dinner&type=2', 'I eat a [pie] for dinner.', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'pie', 'Tôi ăn một cái bánh nướng vào bữa tối.'),
	(391, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+bread&type=2', 'I eat [bread].', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'bread', 'Tôi ăn bánh mì.'),
	(392, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+rice&type=2', 'I eat [rice].', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'rice', 'Tôi ăn cơm.'),
	(393, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+eat+meat&type=2', 'I eat [meat].', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'meat', 'Tôi ăn thịt.');

-- Part 5: Drinks & Sweets (Part 4 skipped in Excel, so Part 5)
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(24, NOW(), NULL, b'0', NOW(), NULL, 4, 'Drinks & Sweets', 10);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(111, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn drinks and sweets vocabulary.', 1, 'INTRODUCTION', 'LOCK', 'Drinks & Sweets', 24);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(394, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drink+milk&type=2', 'I drink milk.', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'milk', 'Tôi uống sữa.'),
	(395, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drink+juice&type=2', 'I drink juice.', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'juice', 'Tôi uống nước ép.'),
	(396, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drink+water&type=2', 'I drink water.', 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'water', 'Tôi uống nước.'),
	(397, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drink+lemonade&type=2', 'I drink lemonade.', 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'lemonade', 'Tôi uống nước chanh.'),
	(398, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+ice+cream&type=2', 'I like ice cream.', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'ice cream', 'Tôi thích kem.'),
	(399, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+chocolate&type=2', 'I like chocolate.', 'https://images.unsplash.com/photo-1549007953-9f85d3b3e2e1?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'chocolate', 'Tôi thích sô cô la.'),
	(400, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+candy&type=2', 'I like candy.', 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'candy', 'Tôi thích kẹo.'),
	(401, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+cake&type=2', 'I like cake.', 'https://images.unsplash.com/photo-1578985545061-69928b1d9584?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'cake', 'Tôi thích bánh ngọt.'),
	(402, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+chips&type=2', 'I like chips.', 'https://images.unsplash.com/photo-1566478989037-eec170784d8b?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'chips', 'Tôi thích khoai tây chiên.'),
	(403, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+sweets&type=2', 'I like sweets.', 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'sweets', 'Tôi thích đồ ngọt.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(112, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice drinks and sweets vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Drinks & Sweets', 24),
	(113, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about drinks and sweets.', 3, 'SPEAKING', 'LOCK', 'Say Drinks & Sweets', 24),
	(114, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What do you drink?', 4, 'WORD_RECOGNITION', 'LOCK', 'Drinks & Sweets Quiz', 24);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(404, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+drink&type=2', 'What do you drink?', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'milk', 'Bạn uống gì?'),
	(686, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+drink&type=2', 'What do you drink?', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'juice', 'Bạn uống gì?'),
	(687, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+drink&type=2', 'What do you drink?', 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'water', 'Bạn uống gì?'),
	(688, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+drink&type=2', 'What do you drink?', 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'lemonade', 'Bạn uống gì?'),
	(689, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+drink&type=2', 'What do you drink?', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'ice cream', 'Bạn uống gì?'),
	(690, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+drink&type=2', 'What do you drink?', 'https://images.unsplash.com/photo-1549007953-9f85d3b3e2e1?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'chocolate', 'Bạn uống gì?'),
	(691, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+drink&type=2', 'What do you drink?', 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'candy', 'Bạn uống gì?'),
	(692, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+drink&type=2', 'What do you drink?', 'https://images.unsplash.com/photo-1578985545061-69928b1d9584?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'cake', 'Bạn uống gì?'),
	(693, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+drink&type=2', 'What do you drink?', 'https://images.unsplash.com/photo-1566478989037-eec170784d8b?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'chips', 'Bạn uống gì?'),
	(694, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+drink&type=2', 'What do you drink?', 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'sweets', 'Bạn uống gì?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(115, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review drinks and sweets vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Drinks & Sweets Adventure', 24);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(405, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drink+milk&type=2', 'I drink [milk].', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'milk', 'Tôi uống sữa.'),
	(406, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drink+juice&type=2', 'I drink [juice].', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'juice', 'Tôi uống nước ép.'),
	(407, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drink+water&type=2', 'I drink [water].', 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'water', 'Tôi uống nước.'),
	(408, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drink+lemonade&type=2', 'I drink [lemonade].', 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'lemonade', 'Tôi uống nước chanh.'),
	(409, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+ice+cream&type=2', 'I like [ice cream].', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'ice cream', 'Tôi thích kem.'),
	(410, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+chocolate&type=2', 'I like [chocolate].', 'https://images.unsplash.com/photo-1549007953-9f85d3b3e2e1?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'chocolate', 'Tôi thích sô cô la.'),
	(411, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+candy&type=2', 'I like [candy].', 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'candy', 'Tôi thích kẹo.'),
	(412, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+cake&type=2', 'I like [cake].', 'https://images.unsplash.com/photo-1578985545061-69928b1d9584?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'cake', 'Tôi thích bánh ngọt.'),
	(413, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+chips&type=2', 'I like [chips].', 'https://images.unsplash.com/photo-1566478989037-eec170784d8b?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'chips', 'Tôi thích khoai tây chiên.'),
	(414, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+sweets&type=2', 'I like [sweets].', 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'sweets', 'Tôi thích đồ ngọt.');

-- =====================================================
-- TOPIC 9: SPORT & LEISURE (id = 11)
-- =====================================================
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`) VALUES
	(11, NOW(), NULL, b'0', NOW(), NULL, 'Learn about sports and leisure activities.', 9, '/images/topics/sport.png', 'SPORT & LEISURE', 3);

-- Part 1: Ball Games
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(25, NOW(), NULL, b'0', NOW(), NULL, 1, 'Ball Games', 11);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(116, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn ball games vocabulary.', 1, 'INTRODUCTION', 'UNLOCK', 'Ball Games', 25);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(415, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+badminton+with+a+racket&type=2', 'I play badminton with a racket.', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'racket', 'Tôi chơi cầu lông với vợt.'),
	(416, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+hit+the+ball+with+a+bat&type=2', 'I hit the ball with a bat.', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'bat', 'Tôi đánh bóng bằng gậy.'),
	(417, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+baseball&type=2', 'I can play baseball.', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'baseball', 'Tôi có thể chơi bóng chày.'),
	(418, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+basketball&type=2', 'I can play basketball.', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'basketball', 'Tôi có thể chơi bóng rổ.'),
	(419, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+football&type=2', 'I can play football.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'football', 'Tôi có thể chơi bóng đá.'),
	(420, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+hockey&type=2', 'I can play hockey.', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'hockey', 'Tôi có thể chơi khúc côn cầu.'),
	(421, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+tennis&type=2', 'I can play tennis.', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'tennis', 'Tôi có thể chơi quần vợt.'),
	(422, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+table+tennis&type=2', 'I can play table tennis.', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'table tennis', 'Tôi có thể chơi bóng bàn.'),
	(423, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+love+this+sport+and+game&type=2', 'I love this sport and game.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'sport', 'Tôi yêu môn thể thao và trò chơi này.'),
	(424, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+love+this+sport+and+game&type=2', 'I love this sport and game.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'game', 'Tôi yêu môn thể thao và trò chơi này.'),
	(425, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+soccer&type=2', 'I can play soccer.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'soccer', 'Tôi có thể chơi bóng đá.'),
	(426, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+badminton&type=2', 'I play badminton.', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'badminton', 'Tôi chơi cầu lông.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(117, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice ball games vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Ball Games', 25),
	(118, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about ball games.', 3, 'SPEAKING', 'LOCK', 'Say Ball Games', 25),
	(119, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What sports do you play?', 4, 'WORD_RECOGNITION', 'LOCK', 'Ball Games Quiz', 25);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(427, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'football', 'Bạn chơi môn thể thao nào?'),
	(695, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'racket', 'Bạn chơi môn thể thao nào?'),
	(696, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'bat', 'Bạn chơi môn thể thao nào?'),
	(697, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'baseball', 'Bạn chơi môn thể thao nào?'),
	(698, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'basketball', 'Bạn chơi môn thể thao nào?'),
	(699, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'hockey', 'Bạn chơi môn thể thao nào?'),
	(700, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'tennis', 'Bạn chơi môn thể thao nào?'),
	(701, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'table tennis', 'Bạn chơi môn thể thao nào?'),
	(702, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'sport', 'Bạn chơi môn thể thao nào?'),
	(703, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'game', 'Bạn chơi môn thể thao nào?'),
	(704, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'soccer', 'Bạn chơi môn thể thao nào?'),
	(705, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+sports+do+you+play&type=2', 'What sports do you play?', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'badminton', 'Bạn chơi môn thể thao nào?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(120, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review ball games vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Ball Games Adventure', 25);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(428, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+badminton+with+a+racket&type=2', 'I play badminton with a [racket].', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'racket', 'Tôi chơi cầu lông với vợt.'),
	(429, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+hit+the+ball+with+a+bat&type=2', 'I hit the ball with a [bat].', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'bat', 'Tôi đánh bóng bằng gậy.'),
	(430, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+baseball&type=2', 'I can play [baseball].', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'baseball', 'Tôi có thể chơi bóng chày.'),
	(431, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+basketball&type=2', 'I can play [basketball].', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'basketball', 'Tôi có thể chơi bóng rổ.'),
	(432, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+football&type=2', 'I can play [football].', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'football', 'Tôi có thể chơi bóng đá.'),
	(433, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+hockey&type=2', 'I can play [hockey].', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'hockey', 'Tôi có thể chơi khúc côn cầu.'),
	(434, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+tennis&type=2', 'I can play [tennis].', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'tennis', 'Tôi có thể chơi quần vợt.'),
	(435, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+table+tennis&type=2', 'I can play [table tennis].', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'table tennis', 'Tôi có thể chơi bóng bàn.'),
	(436, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+love+this+sport+and+game&type=2', 'I love this [sport] and game.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'sport', 'Tôi yêu môn thể thao và trò chơi này.'),
	(437, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+love+this+sport+and+game&type=2', 'I love this sport and [game].', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'game', 'Tôi yêu môn thể thao và trò chơi này.'),
	(438, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+play+soccer&type=2', 'I can play [soccer].', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'soccer', 'Tôi có thể chơi bóng đá.'),
	(439, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+badminton&type=2', 'I play [badminton].', 'https://images.unsplash.com/photo-1534158914592-062992fbe4e8?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'badminton', 'Tôi chơi cầu lông.');

-- Part 2: Physical Actions & Outdoor Activities
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(26, NOW(), NULL, b'0', NOW(), NULL, 2, 'Physical Actions & Outdoor Activities', 11);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(121, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn physical actions and outdoor activities.', 1, 'INTRODUCTION', 'LOCK', 'Actions & Outdoors', 26);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(440, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+run+on+the+beach&type=2', 'I run on the beach.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'run', 'Tôi chạy trên bãi biển.'),
	(441, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+jump&type=2', 'I jump.', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'jump', 'Tôi nhảy.'),
	(442, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+walk&type=2', 'I walk.', 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'walk', 'Tôi đi bộ.'),
	(443, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+swim&type=2', 'I swim.', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'swim', 'Tôi bơi.'),
	(444, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+kick+the+ball&type=2', 'I kick the ball.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'kick', 'Tôi đá bóng.'),
	(445, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+catch+the+ball&type=2', 'I catch the ball.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'catch', 'Tôi bắt bóng.'),
	(446, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+bounce+the+ball&type=2', 'I bounce the ball.', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'bounce', 'Tôi nảy bóng.'),
	(447, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+throw+the+ball&type=2', 'I throw the ball.', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'throw', 'Tôi ném bóng.'),
	(448, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+ride+a+bike&type=2', 'I ride a bike.', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'ride', 'Tôi đạp xe đạp.'),
	(449, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drive+a+boat&type=2', 'I drive a boat.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'drive', 'Tôi lái thuyền.'),
	(450, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+fly+a+kite&type=2', 'I fly a kite.', 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'fly', 'Tôi thả diều.'),
	(451, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+skate&type=2', 'I skate.', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'skate', 'Tôi trượt patin.'),
	(452, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+skateboard&type=2', 'I skateboard.', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'skateboard', 'Tôi trượt ván.'),
	(453, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+go+fishing&type=2', 'I go fishing.', 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'fishing', 'Tôi đi câu cá.'),
	(454, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+ride+my+skateboard&type=2', 'I ride my skateboard.', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'skateboarding', 'Tôi trượt ván của tôi.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(122, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice action vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Actions', 26),
	(123, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about actions.', 3, 'SPEAKING', 'LOCK', 'Say Actions', 26),
	(124, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What do you do?', 4, 'WORD_RECOGNITION', 'LOCK', 'Actions Quiz', 26);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(455, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'run', 'Bạn làm gì?'),
	(706, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'jump', 'Bạn làm gì?'),
	(707, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'walk', 'Bạn làm gì?'),
	(708, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'swim', 'Bạn làm gì?'),
	(709, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'kick', 'Bạn làm gì?'),
	(710, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'catch', 'Bạn làm gì?'),
	(711, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'bounce', 'Bạn làm gì?'),
	(712, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'throw', 'Bạn làm gì?'),
	(713, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'ride', 'Bạn làm gì?'),
	(714, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'drive', 'Bạn làm gì?'),
	(715, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'fly', 'Bạn làm gì?'),
	(716, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'skate', 'Bạn làm gì?'),
	(717, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'skateboard', 'Bạn làm gì?'),
	(718, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'fishing', 'Bạn làm gì?'),
	(719, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+do&type=2', 'What do you do?', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'skateboarding', 'Bạn làm gì?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(125, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review action vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Actions Adventure', 26);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(456, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+run+on+the+beach&type=2', 'I [run] on the beach.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'run', 'Tôi chạy trên bãi biển.'),
	(457, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+jump&type=2', 'I [jump].', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'jump', 'Tôi nhảy.'),
	(458, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+walk&type=2', 'I [walk].', 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'walk', 'Tôi đi bộ.'),
	(459, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+swim&type=2', 'I [swim].', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'swim', 'Tôi bơi.'),
	(460, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+kick+the+ball&type=2', 'I [kick] the ball.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'kick', 'Tôi đá bóng.'),
	(461, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+catch+the+ball&type=2', 'I [catch] the ball.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'catch', 'Tôi bắt bóng.'),
	(462, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+bounce+the+ball&type=2', 'I [bounce] the ball.', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'bounce', 'Tôi nảy bóng.'),
	(463, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+throw+the+ball&type=2', 'I [throw] the ball.', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'throw', 'Tôi ném bóng.'),
	(464, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+ride+a+bike&type=2', 'I [ride] a bike.', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'ride', 'Tôi đạp xe đạp.'),
	(465, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drive+a+boat&type=2', 'I [drive] a boat.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'drive', 'Tôi lái thuyền.'),
	(466, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+fly+a+kite&type=2', 'I [fly] a kite.', 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'fly', 'Tôi thả diều.'),
	(467, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+skate&type=2', 'I [skate].', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'skate', 'Tôi trượt patin.'),
	(468, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+skateboard&type=2', 'I [skateboard].', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'skateboard', 'Tôi trượt ván.'),
	(469, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+go+fishing&type=2', 'I go [fishing].', 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'fishing', 'Tôi đi câu cá.'),
	(470, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+ride+my+skateboard&type=2', 'I ride my [skateboard].', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'skateboarding', 'Tôi trượt ván của tôi.');

-- Part 3: Music, Art & Reading
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(27, NOW(), NULL, b'0', NOW(), NULL, 3, 'Music, Art & Reading', 11);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(126, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn music, art and reading vocabulary.', 1, 'INTRODUCTION', 'LOCK', 'Music, Art & Reading', 27);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(471, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+the+piano&type=2', 'I play the piano.', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'piano', 'Tôi chơi đàn piano.'),
	(472, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+the+guitar&type=2', 'I play the guitar.', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'guitar', 'Tôi chơi đàn guitar.'),
	(473, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+listen+to+music&type=2', 'I listen to music.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'music', 'Tôi nghe nhạc.'),
	(474, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+sing+a+song&type=2', 'I sing a song.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'song', 'Tôi hát một bài hát.'),
	(475, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+sing&type=2', 'I sing.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'sing', 'Tôi hát.'),
	(476, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+draw+a+picture&type=2', 'I draw a picture.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'draw', 'Tôi vẽ một bức tranh.'),
	(477, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+drawing&type=2', 'I like drawing.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'drawing', 'Tôi thích vẽ.'),
	(478, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+read+a+book+and+story&type=2', 'I read a book and story.', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'book', 'Tôi đọc sách và truyện.'),
	(479, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+read+a+book+and+story&type=2', 'I read a book and story.', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'story', 'Tôi đọc sách và truyện.'),
	(480, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+read&type=2', 'I read.', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'read', 'Tôi đọc.'),
	(481, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+listen&type=2', 'I listen.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'listen', 'Tôi lắng nghe.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(127, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice music, art and reading vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Music, Art & Reading', 27),
	(128, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about music, art and reading.', 3, 'SPEAKING', 'LOCK', 'Say Music, Art & Reading', 27),
	(129, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What do you like doing?', 4, 'WORD_RECOGNITION', 'LOCK', 'Music, Art & Reading Quiz', 27);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(482, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'piano', 'Bạn thích làm gì?'),
	(720, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'guitar', 'Bạn thích làm gì?'),
	(721, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'music', 'Bạn thích làm gì?'),
	(722, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'song', 'Bạn thích làm gì?'),
	(723, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'sing', 'Bạn thích làm gì?'),
	(724, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'draw', 'Bạn thích làm gì?'),
	(725, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'drawing', 'Bạn thích làm gì?'),
	(726, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'book', 'Bạn thích làm gì?'),
	(727, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'story', 'Bạn thích làm gì?'),
	(728, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'read', 'Bạn thích làm gì?'),
	(729, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'listen', 'Bạn thích làm gì?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(130, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review music, art and reading vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Music, Art & Reading Adventure', 27);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(483, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+the+piano&type=2', 'I play the [piano].', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'piano', 'Tôi chơi đàn piano.'),
	(484, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+the+guitar&type=2', 'I play the [guitar].', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'guitar', 'Tôi chơi đàn guitar.'),
	(485, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+listen+to+music&type=2', 'I listen to [music].', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'music', 'Tôi nghe nhạc.'),
	(486, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+sing+a+song&type=2', 'I sing a [song].', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'song', 'Tôi hát một bài hát.'),
	(487, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+sing&type=2', 'I [sing].', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'sing', 'Tôi hát.'),
	(488, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+draw+a+picture&type=2', 'I [draw] a picture.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'draw', 'Tôi vẽ một bức tranh.'),
	(489, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+drawing&type=2', 'I like [drawing].', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'drawing', 'Tôi thích vẽ.'),
	(490, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+read+a+book+and+story&type=2', 'I read a [book] and story.', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'book', 'Tôi đọc sách và truyện.'),
	(491, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+read+a+book+and+story&type=2', 'I read a book and [story].', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'story', 'Tôi đọc sách và truyện.'),
	(492, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+read&type=2', 'I [read].', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'read', 'Tôi đọc.'),
	(493, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+listen&type=2', 'I [listen].', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'listen', 'Tôi lắng nghe.');

-- Part 4: Entertainment, Hobbies & Toys
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(28, NOW(), NULL, b'0', NOW(), NULL, 4, 'Entertainment, Hobbies & Toys', 11);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(131, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn entertainment, hobbies and toys vocabulary.', 1, 'INTRODUCTION', 'LOCK', 'Entertainment & Hobbies', 28);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(494, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+watch+television&type=2', 'I watch television.', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'television', 'Tôi xem tivi.'),
	(495, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+watch+TV&type=2', 'I watch TV.', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'TV', 'Tôi xem tivi.'),
	(496, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+listen+to+the+radio&type=2', 'I listen to the radio.', 'https://images.unsplash.com/photo-1508700115895-45b8c6e1a489?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'radio', 'Tôi nghe đài.'),
	(497, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+watch&type=2', 'I watch.', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'watch', 'Tôi xem.'),
	(498, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+use+a+camera+to+take+a+photo&type=2', 'I use a camera to take a photo.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'camera', 'Tôi dùng máy ảnh để chụp ảnh.'),
	(499, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+use+a+camera+to+take+a+photo&type=2', 'I use a camera to take a photo.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'photo', 'Tôi dùng máy ảnh để chụp ảnh.'),
	(500, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+with+a+toy+and+doll&type=2', 'I play with a toy and doll.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'toy', 'Tôi chơi với đồ chơi và búp bê.'),
	(501, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+with+a+toy+and+doll&type=2', 'I play with a toy and doll.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'doll', 'Tôi chơi với đồ chơi và búp bê.'),
	(502, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play&type=2', 'I play.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'play', 'Tôi chơi.'),
	(503, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+a+hobby&type=2', 'I have a hobby.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'hobby', 'Tôi có một sở thích.'),
	(504, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+a+favourite&type=2', 'I have a favourite.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'favourite', 'Tôi có một thứ yêu thích.'),
	(505, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+enjoy&type=2', 'I enjoy.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'enjoy', 'Tôi thích thú.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(132, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice entertainment vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Entertainment', 28),
	(133, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about entertainment and hobbies.', 3, 'SPEAKING', 'LOCK', 'Say Entertainment', 28),
	(134, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: What do you like doing?', 4, 'WORD_RECOGNITION', 'LOCK', 'Entertainment Quiz', 28);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(506, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'television', 'Bạn thích làm gì?'),
	(730, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'TV', 'Bạn thích làm gì?'),
	(731, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1508700115895-45b8c6e1a489?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'radio', 'Bạn thích làm gì?'),
	(732, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'watch', 'Bạn thích làm gì?'),
	(733, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'camera', 'Bạn thích làm gì?'),
	(734, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'photo', 'Bạn thích làm gì?'),
	(735, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'toy', 'Bạn thích làm gì?'),
	(736, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'doll', 'Bạn thích làm gì?'),
	(737, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'play', 'Bạn thích làm gì?'),
	(738, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'hobby', 'Bạn thích làm gì?'),
	(739, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'favourite', 'Bạn thích làm gì?'),
	(740, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+do+you+like+doing&type=2', 'What do you like doing?', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'enjoy', 'Bạn thích làm gì?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(135, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review entertainment vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Entertainment Adventure', 28);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(507, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+watch+television&type=2', 'I watch [television].', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'television', 'Tôi xem tivi.'),
	(508, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+watch+TV&type=2', 'I watch [TV].', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'TV', 'Tôi xem tivi.'),
	(509, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+listen+to+the+radio&type=2', 'I listen to the [radio].', 'https://images.unsplash.com/photo-1508700115895-45b8c6e1a489?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'radio', 'Tôi nghe đài.'),
	(510, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+watch&type=2', 'I [watch].', 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'watch', 'Tôi xem.'),
	(511, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+use+a+camera+to+take+a+photo&type=2', 'I use a [camera] to take a photo.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'camera', 'Tôi dùng máy ảnh để chụp ảnh.'),
	(512, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+use+a+camera+to+take+a+photo&type=2', 'I use a camera to take a [photo].', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'photo', 'Tôi dùng máy ảnh để chụp ảnh.'),
	(513, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+with+a+toy+and+doll&type=2', 'I play with a [toy] and doll.', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'toy', 'Tôi chơi với đồ chơi và búp bê.'),
	(514, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play+with+a+toy+and+doll&type=2', 'I play with a toy and [doll].', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'doll', 'Tôi chơi với đồ chơi và búp bê.'),
	(515, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+play&type=2', 'I [play].', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'play', 'Tôi chơi.'),
	(516, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+a+hobby&type=2', 'I have a [hobby].', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'hobby', 'Tôi có một sở thích.'),
	(517, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+have+a+favourite&type=2', 'I have a [favourite].', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'favourite', 'Tôi có một thứ yêu thích.'),
	(518, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+enjoy&type=2', 'I [enjoy].', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'enjoy', 'Tôi thích thú.');

-- =====================================================
-- TOPIC 10: TRANSPORT (id = 12, considered as topic 10 in sequence)
-- =====================================================
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`) VALUES
	(12, NOW(), NULL, b'0', NOW(), NULL, 'Learn about transport vehicles.', 10, '/images/topics/transport.png', 'TRANSPORT', 3);

-- Part 1: Vehicles
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`) VALUES
	(29, NOW(), NULL, b'0', NOW(), NULL, 1, 'Vehicles', 12);

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(136, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Learn transport vocabulary.', 1, 'INTRODUCTION', 'UNLOCK', 'Vehicles', 29);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(519, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+ride+a+bike&type=2', 'I ride a bike.', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'bike', 'Tôi đạp xe đạp.'),
	(520, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drive+a+car&type=2', 'I drive a car.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'car', 'Tôi lái ô tô.'),
	(521, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+go+by+bus&type=2', 'I go by bus.', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'bus', 'Tôi đi bằng xe buýt.'),
	(522, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+go+by+train&type=2', 'I go by train.', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'train', 'Tôi đi bằng tàu hỏa.'),
	(523, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+fly+a+plane&type=2', 'I fly a plane.', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'plane', 'Tôi lái máy bay.'),
	(524, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+fly+a+helicopter&type=2', 'I fly a helicopter.', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'helicopter', 'Tôi lái trực thăng.'),
	(525, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drive+a+truck&type=2', 'I drive a truck.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'truck', 'Tôi lái xe tải.'),
	(526, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drive+a+lorry&type=2', 'I drive a lorry.', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'lorry', 'Tôi lái xe tải lớn.'),
	(527, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+ride+a+motorbike&type=2', 'I ride a motorbike.', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'motorbike', 'Tôi đi xe máy.'),
	(528, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+go+by+ship&type=2', 'I go by ship.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'ship', 'Tôi đi bằng tàu thủy.'),
	(529, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drive+a+boat&type=2', 'I drive a boat.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'FLASHCARD', 'boat', 'Tôi lái thuyền.');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(137, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Listen and practice transport vocabulary.', 2, 'LISTENING', 'LOCK', 'Listen to Transport', 29),
	(138, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Practice speaking about transport.', 3, 'SPEAKING', 'LOCK', 'Say Transport', 29),
	(139, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Quiz: How do you go?', 4, 'WORD_RECOGNITION', 'LOCK', 'Transport Quiz', 29);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(530, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+do+you+go&type=2', 'How do you go?', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'bike', 'Bạn đi bằng phương tiện gì?'),
	(741, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+do+you+go&type=2', 'How do you go?', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'car', 'Bạn đi bằng phương tiện gì?'),
	(742, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+do+you+go&type=2', 'How do you go?', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'bus', 'Bạn đi bằng phương tiện gì?'),
	(743, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+do+you+go&type=2', 'How do you go?', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'train', 'Bạn đi bằng phương tiện gì?'),
	(744, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+do+you+go&type=2', 'How do you go?', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'plane', 'Bạn đi bằng phương tiện gì?'),
	(745, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+do+you+go&type=2', 'How do you go?', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'helicopter', 'Bạn đi bằng phương tiện gì?'),
	(746, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+do+you+go&type=2', 'How do you go?', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'truck', 'Bạn đi bằng phương tiện gì?'),
	(747, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+do+you+go&type=2', 'How do you go?', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'lorry', 'Bạn đi bằng phương tiện gì?'),
	(748, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+do+you+go&type=2', 'How do you go?', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'motorbike', 'Bạn đi bằng phương tiện gì?'),
	(749, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+do+you+go&type=2', 'How do you go?', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'ship', 'Bạn đi bằng phương tiện gì?'),
	(750, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=How+do+you+go&type=2', 'How do you go?', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'QUIZ', 'boat', 'Bạn đi bằng phương tiện gì?');

INSERT INTO `sessions` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `order_index`, `session_type`, `status`, `title`, `part_id`) VALUES
	(140, NOW(), NULL, b'0', NOW(), NULL, NULL, 'Review transport vocabulary with games!', 5, 'GAMIFIED_REVIEW', 'LOCK', 'Transport Adventure', 29);

INSERT INTO `session_items` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `content_text`, `image_url`, `item_type`, `keyword`, `translation`) VALUES
	(531, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+ride+a+bike&type=2', 'I ride a [bike].', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'bike', 'Tôi đạp xe đạp.'),
	(532, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drive+a+car&type=2', 'I drive a [car].', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'car', 'Tôi lái ô tô.'),
	(533, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+go+by+bus&type=2', 'I go by [bus].', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'bus', 'Tôi đi bằng xe buýt.'),
	(534, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+go+by+train&type=2', 'I go by [train].', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'train', 'Tôi đi bằng tàu hỏa.'),
	(535, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+fly+a+plane&type=2', 'I fly a [plane].', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'plane', 'Tôi lái máy bay.'),
	(536, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+fly+a+helicopter&type=2', 'I fly a [helicopter].', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'helicopter', 'Tôi lái trực thăng.'),
	(537, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drive+a+truck&type=2', 'I drive a [truck].', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'truck', 'Tôi lái xe tải.'),
	(538, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drive+a+lorry&type=2', 'I drive a [lorry].', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'lorry', 'Tôi lái xe tải lớn.'),
	(539, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+ride+a+motorbike&type=2', 'I ride a [motorbike].', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'motorbike', 'Tôi đi xe máy.'),
	(540, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+go+by+ship&type=2', 'I go by [ship].', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'ship', 'Tôi đi bằng tàu thủy.'),
	(541, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=I+drive+a+boat&type=2', 'I drive a [boat].', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 'FILL_IN_BLANK', 'boat', 'Tôi lái thuyền.');

-- =====================================================
-- SESSION ITEM MAPPINGS for TOPICS 6-10
-- =====================================================
INSERT INTO `session_item_mappings` (`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `session_id`, `session_item_id`) VALUES
	-- Rooms
	(NOW(), NULL, b'0', NOW(), NULL, 1, 66, 207),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 66, 208),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 66, 209),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 66, 210),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 66, 211),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 66, 212),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 66, 213),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 66, 214),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 66, 215),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 66, 216),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 67, 207),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 67, 208),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 67, 209),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 67, 210),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 67, 211),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 67, 212),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 67, 213),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 67, 214),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 67, 215),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 67, 216),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 68, 207),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 68, 208),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 68, 209),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 68, 210),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 68, 211),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 68, 212),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 68, 213),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 68, 214),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 68, 215),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 68, 216),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 69, 217),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 69, 606),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 69, 607),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 69, 608),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 69, 609),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 69, 610),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 69, 611),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 69, 612),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 69, 613),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 69, 614),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 70, 218),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 70, 219),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 70, 220),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 70, 221),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 70, 222),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 70, 223),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 70, 224),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 70, 225),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 70, 226),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 70, 227),
	-- Furniture 1
	(NOW(), NULL, b'0', NOW(), NULL, 1, 71, 228),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 71, 229),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 71, 230),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 71, 231),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 71, 232),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 71, 233),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 71, 234),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 71, 235),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 71, 236),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 72, 228),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 72, 229),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 72, 230),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 72, 231),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 72, 232),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 72, 233),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 72, 234),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 72, 235),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 72, 236),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 73, 228),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 73, 229),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 73, 230),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 73, 231),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 73, 232),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 73, 233),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 73, 234),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 73, 235),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 73, 236),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 74, 237),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 74, 615),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 74, 616),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 74, 617),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 74, 618),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 74, 619),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 74, 620),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 74, 621),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 74, 622),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 75, 238),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 75, 239),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 75, 240),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 75, 241),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 75, 242),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 75, 243),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 75, 244),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 75, 245),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 75, 246),
	-- Furniture 2
	(NOW(), NULL, b'0', NOW(), NULL, 1, 76, 247),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 76, 248),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 76, 249),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 76, 250),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 76, 251),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 76, 252),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 76, 253),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 76, 254),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 76, 255),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 77, 247),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 77, 248),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 77, 249),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 77, 250),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 77, 251),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 77, 252),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 77, 253),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 77, 254),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 77, 255),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 78, 247),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 78, 248),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 78, 249),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 78, 250),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 78, 251),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 78, 252),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 78, 253),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 78, 254),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 78, 255),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 79, 256),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 79, 623),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 79, 624),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 79, 625),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 79, 626),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 79, 627),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 79, 628),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 79, 629),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 79, 630),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 80, 257),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 80, 258),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 80, 259),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 80, 260),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 80, 261),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 80, 262),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 80, 263),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 80, 264),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 80, 265),
	-- Electronics
	(NOW(), NULL, b'0', NOW(), NULL, 1, 81, 266),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 81, 267),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 81, 268),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 81, 269),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 81, 270),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 81, 271),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 81, 272),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 81, 273),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 81, 274),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 82, 266),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 82, 267),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 82, 268),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 82, 269),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 82, 270),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 82, 271),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 82, 272),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 82, 273),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 82, 274),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 83, 266),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 83, 267),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 83, 268),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 83, 269),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 83, 270),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 83, 271),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 83, 272),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 83, 273),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 83, 274),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 84, 275),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 84, 631),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 84, 632),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 84, 633),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 84, 634),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 84, 635),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 84, 636),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 84, 637),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 84, 638),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 85, 276),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 85, 277),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 85, 278),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 85, 279),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 85, 280),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 85, 281),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 85, 282),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 85, 283),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 85, 284),
	-- Numbers 1-10
	(NOW(), NULL, b'0', NOW(), NULL, 1, 86, 285),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 86, 286),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 86, 287),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 86, 288),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 86, 289),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 86, 290),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 86, 291),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 86, 292),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 86, 293),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 86, 294),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 87, 285),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 87, 286),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 87, 287),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 87, 288),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 87, 289),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 87, 290),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 87, 291),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 87, 292),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 87, 293),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 87, 294),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 88, 285),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 88, 286),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 88, 287),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 88, 288),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 88, 289),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 88, 290),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 88, 291),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 88, 292),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 88, 293),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 88, 294),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 89, 295),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 89, 639),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 89, 640),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 89, 641),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 89, 642),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 89, 643),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 89, 644),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 89, 645),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 89, 646),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 89, 647),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 90, 296),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 90, 297),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 90, 298),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 90, 299),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 90, 300),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 90, 301),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 90, 302),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 90, 303),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 90, 304),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 90, 305),
	-- Numbers 11-20
	(NOW(), NULL, b'0', NOW(), NULL, 1, 91, 306),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 91, 307),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 91, 308),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 91, 309),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 91, 310),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 91, 311),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 91, 312),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 91, 313),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 91, 314),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 91, 315),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 92, 306),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 92, 307),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 92, 308),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 92, 309),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 92, 310),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 92, 311),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 92, 312),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 92, 313),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 92, 314),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 92, 315),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 93, 306),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 93, 307),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 93, 308),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 93, 309),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 93, 310),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 93, 311),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 93, 312),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 93, 313),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 93, 314),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 93, 315),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 94, 316),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 94, 648),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 94, 649),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 94, 650),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 94, 651),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 94, 652),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 94, 653),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 94, 654),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 94, 655),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 94, 656),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 95, 317),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 95, 318),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 95, 319),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 95, 320),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 95, 321),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 95, 322),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 95, 323),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 95, 324),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 95, 325),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 95, 326),
	-- Fruit 1
	(NOW(), NULL, b'0', NOW(), NULL, 1, 96, 327),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 96, 328),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 96, 329),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 96, 330),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 96, 331),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 96, 332),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 96, 333),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 96, 334),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 96, 335),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 96, 336),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 97, 327),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 97, 328),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 97, 329),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 97, 330),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 97, 331),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 97, 332),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 97, 333),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 97, 334),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 97, 335),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 97, 336),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 98, 327),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 98, 328),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 98, 329),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 98, 330),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 98, 331),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 98, 332),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 98, 333),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 98, 334),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 98, 335),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 98, 336),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 99, 337),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 99, 657),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 99, 658),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 99, 659),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 99, 660),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 99, 661),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 99, 662),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 99, 663),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 99, 664),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 99, 665),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 100, 338),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 100, 339),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 100, 340),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 100, 341),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 100, 342),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 100, 343),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 100, 344),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 100, 345),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 100, 346),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 100, 347),
	-- Fruit 2 & Vegetables
	(NOW(), NULL, b'0', NOW(), NULL, 1, 101, 348),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 101, 349),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 101, 350),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 101, 351),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 101, 352),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 101, 353),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 101, 354),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 101, 355),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 102, 348),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 102, 349),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 102, 350),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 102, 351),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 102, 352),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 102, 353),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 102, 354),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 102, 355),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 103, 348),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 103, 349),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 103, 350),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 103, 351),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 103, 352),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 103, 353),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 103, 354),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 103, 355),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 104, 356),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 104, 666),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 104, 667),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 104, 668),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 104, 669),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 104, 670),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 104, 671),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 104, 672),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 105, 357),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 105, 358),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 105, 359),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 105, 360),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 105, 361),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 105, 362),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 105, 363),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 105, 364),
	-- Meals & Meat
	(NOW(), NULL, b'0', NOW(), NULL, 1, 106, 365),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 106, 366),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 106, 367),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 106, 368),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 106, 369),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 106, 370),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 106, 371),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 106, 372),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 106, 373),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 106, 374),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 106, 375),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 106, 376),
	(NOW(), NULL, b'0', NOW(), NULL, 13, 106, 377),
	(NOW(), NULL, b'0', NOW(), NULL, 14, 106, 378),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 107, 365),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 107, 366),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 107, 367),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 107, 368),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 107, 369),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 107, 370),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 107, 371),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 107, 372),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 107, 373),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 107, 374),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 107, 375),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 107, 376),
	(NOW(), NULL, b'0', NOW(), NULL, 13, 107, 377),
	(NOW(), NULL, b'0', NOW(), NULL, 14, 107, 378),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 108, 365),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 108, 366),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 108, 367),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 108, 368),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 108, 369),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 108, 370),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 108, 371),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 108, 372),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 108, 373),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 108, 374),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 108, 375),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 108, 376),
	(NOW(), NULL, b'0', NOW(), NULL, 13, 108, 377),
	(NOW(), NULL, b'0', NOW(), NULL, 14, 108, 378),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 109, 379),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 109, 673),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 109, 674),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 109, 675),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 109, 676),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 109, 677),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 109, 678),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 109, 679),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 109, 680),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 109, 681),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 109, 682),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 109, 683),
	(NOW(), NULL, b'0', NOW(), NULL, 13, 109, 684),
	(NOW(), NULL, b'0', NOW(), NULL, 14, 109, 685),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 110, 380),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 110, 381),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 110, 382),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 110, 383),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 110, 384),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 110, 385),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 110, 386),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 110, 387),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 110, 388),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 110, 389),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 110, 390),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 110, 391),
	(NOW(), NULL, b'0', NOW(), NULL, 13, 110, 392),
	(NOW(), NULL, b'0', NOW(), NULL, 14, 110, 393),
	-- Drinks & Sweets
	(NOW(), NULL, b'0', NOW(), NULL, 1, 111, 394),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 111, 395),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 111, 396),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 111, 397),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 111, 398),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 111, 399),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 111, 400),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 111, 401),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 111, 402),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 111, 403),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 112, 394),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 112, 395),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 112, 396),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 112, 397),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 112, 398),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 112, 399),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 112, 400),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 112, 401),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 112, 402),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 112, 403),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 113, 394),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 113, 395),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 113, 396),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 113, 397),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 113, 398),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 113, 399),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 113, 400),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 113, 401),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 113, 402),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 113, 403),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 114, 404),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 114, 686),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 114, 687),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 114, 688),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 114, 689),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 114, 690),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 114, 691),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 114, 692),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 114, 693),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 114, 694),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 115, 405),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 115, 406),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 115, 407),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 115, 408),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 115, 409),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 115, 410),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 115, 411),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 115, 412),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 115, 413),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 115, 414),
	-- Ball Games
	(NOW(), NULL, b'0', NOW(), NULL, 1, 116, 415),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 116, 416),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 116, 417),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 116, 418),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 116, 419),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 116, 420),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 116, 421),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 116, 422),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 116, 423),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 116, 424),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 116, 425),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 116, 426),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 117, 415),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 117, 416),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 117, 417),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 117, 418),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 117, 419),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 117, 420),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 117, 421),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 117, 422),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 117, 423),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 117, 424),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 117, 425),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 117, 426),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 118, 415),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 118, 416),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 118, 417),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 118, 418),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 118, 419),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 118, 420),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 118, 421),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 118, 422),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 118, 423),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 118, 424),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 118, 425),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 118, 426),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 119, 427),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 119, 695),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 119, 696),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 119, 697),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 119, 698),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 119, 699),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 119, 700),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 119, 701),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 119, 702),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 119, 703),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 119, 704),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 119, 705),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 120, 428),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 120, 429),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 120, 430),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 120, 431),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 120, 432),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 120, 433),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 120, 434),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 120, 435),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 120, 436),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 120, 437),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 120, 438),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 120, 439),
	-- Actions
	(NOW(), NULL, b'0', NOW(), NULL, 1, 121, 440),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 121, 441),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 121, 442),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 121, 443),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 121, 444),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 121, 445),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 121, 446),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 121, 447),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 121, 448),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 121, 449),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 121, 450),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 121, 451),
	(NOW(), NULL, b'0', NOW(), NULL, 13, 121, 452),
	(NOW(), NULL, b'0', NOW(), NULL, 14, 121, 453),
	(NOW(), NULL, b'0', NOW(), NULL, 15, 121, 454),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 122, 440),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 122, 441),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 122, 442),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 122, 443),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 122, 444),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 122, 445),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 122, 446),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 122, 447),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 122, 448),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 122, 449),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 122, 450),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 122, 451),
	(NOW(), NULL, b'0', NOW(), NULL, 13, 122, 452),
	(NOW(), NULL, b'0', NOW(), NULL, 14, 122, 453),
	(NOW(), NULL, b'0', NOW(), NULL, 15, 122, 454),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 123, 440),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 123, 441),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 123, 442),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 123, 443),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 123, 444),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 123, 445),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 123, 446),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 123, 447),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 123, 448),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 123, 449),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 123, 450),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 123, 451),
	(NOW(), NULL, b'0', NOW(), NULL, 13, 123, 452),
	(NOW(), NULL, b'0', NOW(), NULL, 14, 123, 453),
	(NOW(), NULL, b'0', NOW(), NULL, 15, 123, 454),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 124, 455),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 124, 706),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 124, 707),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 124, 708),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 124, 709),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 124, 710),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 124, 711),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 124, 712),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 124, 713),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 124, 714),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 124, 715),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 124, 716),
	(NOW(), NULL, b'0', NOW(), NULL, 13, 124, 717),
	(NOW(), NULL, b'0', NOW(), NULL, 14, 124, 718),
	(NOW(), NULL, b'0', NOW(), NULL, 15, 124, 719),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 125, 456),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 125, 457),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 125, 458),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 125, 459),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 125, 460),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 125, 461),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 125, 462),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 125, 463),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 125, 464),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 125, 465),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 125, 466),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 125, 467),
	(NOW(), NULL, b'0', NOW(), NULL, 13, 125, 468),
	(NOW(), NULL, b'0', NOW(), NULL, 14, 125, 469),
	(NOW(), NULL, b'0', NOW(), NULL, 15, 125, 470),
	-- Music, Art & Reading
	(NOW(), NULL, b'0', NOW(), NULL, 1, 126, 471),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 126, 472),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 126, 473),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 126, 474),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 126, 475),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 126, 476),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 126, 477),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 126, 478),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 126, 479),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 126, 480),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 126, 481),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 127, 471),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 127, 472),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 127, 473),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 127, 474),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 127, 475),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 127, 476),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 127, 477),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 127, 478),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 127, 479),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 127, 480),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 127, 481),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 128, 471),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 128, 472),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 128, 473),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 128, 474),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 128, 475),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 128, 476),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 128, 477),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 128, 478),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 128, 479),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 128, 480),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 128, 481),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 129, 482),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 129, 720),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 129, 721),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 129, 722),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 129, 723),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 129, 724),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 129, 725),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 129, 726),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 129, 727),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 129, 728),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 129, 729),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 130, 483),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 130, 484),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 130, 485),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 130, 486),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 130, 487),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 130, 488),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 130, 489),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 130, 490),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 130, 491),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 130, 492),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 130, 493),
	-- Entertainment
	(NOW(), NULL, b'0', NOW(), NULL, 1, 131, 494),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 131, 495),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 131, 496),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 131, 497),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 131, 498),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 131, 499),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 131, 500),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 131, 501),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 131, 502),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 131, 503),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 131, 504),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 131, 505),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 132, 494),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 132, 495),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 132, 496),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 132, 497),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 132, 498),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 132, 499),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 132, 500),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 132, 501),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 132, 502),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 132, 503),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 132, 504),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 132, 505),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 133, 494),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 133, 495),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 133, 496),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 133, 497),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 133, 498),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 133, 499),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 133, 500),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 133, 501),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 133, 502),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 133, 503),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 133, 504),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 133, 505),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 134, 506),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 134, 730),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 134, 731),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 134, 732),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 134, 733),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 134, 734),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 134, 735),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 134, 736),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 134, 737),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 134, 738),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 134, 739),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 134, 740),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 135, 507),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 135, 508),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 135, 509),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 135, 510),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 135, 511),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 135, 512),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 135, 513),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 135, 514),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 135, 515),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 135, 516),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 135, 517),
	(NOW(), NULL, b'0', NOW(), NULL, 12, 135, 518),
	-- Transport
	(NOW(), NULL, b'0', NOW(), NULL, 1, 136, 519),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 136, 520),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 136, 521),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 136, 522),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 136, 523),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 136, 524),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 136, 525),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 136, 526),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 136, 527),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 136, 528),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 136, 529),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 137, 519),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 137, 520),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 137, 521),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 137, 522),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 137, 523),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 137, 524),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 137, 525),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 137, 526),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 137, 527),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 137, 528),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 137, 529),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 138, 519),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 138, 520),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 138, 521),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 138, 522),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 138, 523),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 138, 524),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 138, 525),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 138, 526),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 138, 527),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 138, 528),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 138, 529),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 139, 530),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 139, 741),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 139, 742),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 139, 743),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 139, 744),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 139, 745),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 139, 746),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 139, 747),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 139, 748),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 139, 749),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 139, 750),
	(NOW(), NULL, b'0', NOW(), NULL, 1, 140, 531),
	(NOW(), NULL, b'0', NOW(), NULL, 2, 140, 532),
	(NOW(), NULL, b'0', NOW(), NULL, 3, 140, 533),
	(NOW(), NULL, b'0', NOW(), NULL, 4, 140, 534),
	(NOW(), NULL, b'0', NOW(), NULL, 5, 140, 535),
	(NOW(), NULL, b'0', NOW(), NULL, 6, 140, 536),
	(NOW(), NULL, b'0', NOW(), NULL, 7, 140, 537),
	(NOW(), NULL, b'0', NOW(), NULL, 8, 140, 538),
	(NOW(), NULL, b'0', NOW(), NULL, 9, 140, 539),
	(NOW(), NULL, b'0', NOW(), NULL, 10, 140, 540),
	(NOW(), NULL, b'0', NOW(), NULL, 11, 140, 541);