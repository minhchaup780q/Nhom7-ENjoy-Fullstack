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
	(57, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/head.webp', 'QUIZ', 'head', 'Bạn có gì?');

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
	(71, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/arms.webp', 'QUIZ', 'arms', 'Bạn có gì?');

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
	(83, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=Who+is+this&type=2', 'Who is this?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/mother.webp', 'QUIZ', 'mother', 'Đây là ai?');

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
	(96, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+have+you+got&type=2', 'What have you got?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/cat.webp', 'QUIZ', 'cat', 'Bạn có gì?');

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
	(110, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+is+it&type=2', 'What is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/cow.webp', 'QUIZ', 'cow', 'Nó là gì?');

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
	(125, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+can+you+see&type=2', 'What can you see?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bear.webp', 'QUIZ', 'bear', 'Bạn có thể nhìn thấy gì?');

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
	(140, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+animal+is+it&type=2', 'What animal is it?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/frog.webp', 'QUIZ', 'frog', 'Nó là con vật gì?');

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
	(158, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/t-shirt.webp', 'QUIZ', 'T-shirt', 'Bạn đang mặc gì?');

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
	(176, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+are+you+wearing&type=2', 'What are you wearing?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hat.webp', 'QUIZ', 'hat', 'Bạn đang mặc gì?');

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
	(195, NOW(), NULL, b'0', NOW(), NULL, 'https://dict.youdao.com/dictvoice?audio=What+colour+is+the+ball&type=2', 'What colour is the ball?', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/black.webp', 'QUIZ', 'black', 'Quả bóng màu gì?');

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