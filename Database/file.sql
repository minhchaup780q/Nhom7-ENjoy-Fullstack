-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Ảnh & audio linh hoạt theo từng word
-- Tất cả sessions: payload = NULL
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 1. LEVEL
-- ------------------------------------------------------------
INSERT INTO `levels` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `code`, `name`, `order_index`)
VALUES
(1, NOW(), 1, 0, NOW(), 1, 'PRE_A1', 'Pre A1 - Beginner', 1);

-- ------------------------------------------------------------
-- 2. TOPICS
-- ------------------------------------------------------------
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(1, NOW(), 1, 0, NOW(), 1, 'Numbers from 1 to 20', 1,
 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
 'Number', 1),
(2, NOW(), 1, 0, NOW(), 1, 'Body parts vocabulary', 2,
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
 'Body', 1);

-- ------------------------------------------------------------
-- 3. PARTS
-- ------------------------------------------------------------
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`)
VALUES
(1, NOW(), 1, 0, NOW(), 1, 1, 'Number 1-10', 1),
(2, NOW(), 1, 0, NOW(), 1, 2, 'Number 10-20', 1),
(3, NOW(), 1, 0, NOW(), 1, 1, 'Body Parts 1', 2),
(4, NOW(), 1, 0, NOW(), 1, 2, 'Body Parts 2', 2);

-- ------------------------------------------------------------
-- 4. VOCABULARIES
-- ------------------------------------------------------------
INSERT INTO `vocabularies` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `audio_url`, `image_url`, `translation`, `word`)
VALUES
-- Numbers 1-10
(1,  NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=one&type=2',
 'https://dummyimage.com/600x400/4CAF50/ffffff.png&text=1+-+One', 'một', 'one'),
(2,  NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=two&type=2',
 'https://dummyimage.com/600x400/2196F3/ffffff.png&text=2+-+Two', 'hai', 'two'),
(3,  NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=three&type=2',
 'https://dummyimage.com/600x400/FF9800/ffffff.png&text=3+-+Three', 'ba', 'three'),
(4,  NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=four&type=2',
 'https://dummyimage.com/600x400/E91E63/ffffff.png&text=4+-+Four', 'bốn', 'four'),
(5,  NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=five&type=2',
 'https://dummyimage.com/600x400/9C27B0/ffffff.png&text=5+-+Five', 'năm', 'five'),
(6,  NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=six&type=2',
 'https://dummyimage.com/600x400/00BCD4/ffffff.png&text=6+-+Six', 'sáu', 'six'),
(7,  NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=seven&type=2',
 'https://dummyimage.com/600x400/3F51B5/ffffff.png&text=7+-+Seven', 'bảy', 'seven'),
(8,  NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=eight&type=2',
 'https://dummyimage.com/600x400/8BC34A/ffffff.png&text=8+-+Eight', 'tám', 'eight'),
(9,  NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=nine&type=2',
 'https://dummyimage.com/600x400/FF5722/ffffff.png&text=9+-+Nine', 'chín', 'nine'),
(10, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=ten&type=2',
 'https://dummyimage.com/600x400/607D8B/ffffff.png&text=10+-+Ten', 'mười', 'ten'),

-- Numbers 10-20
(11, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=ten&type=2',
 'https://dummyimage.com/600x400/607D8B/ffffff.png&text=10+-+Ten', 'mười', 'ten'),
(12, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=eleven&type=2',
 'https://dummyimage.com/600x400/3F51B5/ffffff.png&text=11+-+Eleven', 'mười một', 'eleven'),
(13, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=twelve&type=2',
 'https://dummyimage.com/600x400/009688/ffffff.png&text=12+-+Twelve', 'mười hai', 'twelve'),
(14, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=thirteen&type=2',
 'https://dummyimage.com/600x400/4CAF50/ffffff.png&text=13+-+Thirteen', 'mười ba', 'thirteen'),
(15, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=fourteen&type=2',
 'https://dummyimage.com/600x400/8BC34A/ffffff.png&text=14+-+Fourteen', 'mười bốn', 'fourteen'),
(16, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=fifteen&type=2',
 'https://dummyimage.com/600x400/FF9800/ffffff.png&text=15+-+Fifteen', 'mười lăm', 'fifteen'),
(17, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=sixteen&type=2',
 'https://dummyimage.com/600x400/FF5722/ffffff.png&text=16+-+Sixteen', 'mười sáu', 'sixteen'),
(18, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=seventeen&type=2',
 'https://dummyimage.com/600x400/E91E63/ffffff.png&text=17+-+Seventeen', 'mười bảy', 'seventeen'),
(19, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=eighteen&type=2',
 'https://dummyimage.com/600x400/9C27B0/ffffff.png&text=18+-+Eighteen', 'mười tám', 'eighteen'),
(20, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=nineteen&type=2',
 'https://dummyimage.com/600x400/673AB7/ffffff.png&text=19+-+Nineteen', 'mười chín', 'nineteen'),
(21, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=twenty&type=2',
 'https://dummyimage.com/600x400/2196F3/ffffff.png&text=20+-+Twenty', 'hai mươi', 'twenty'),

-- Body parts
(22, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=head&type=2',
 'https://dummyimage.com/600x400/03A9F4/ffffff.png&text=Head', 'đầu', 'head'),
(23, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=eye&type=2',
 'https://dummyimage.com/600x400/00BCD4/ffffff.png&text=Eye', 'mắt', 'eye'),
(24, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=ear&type=2',
 'https://dummyimage.com/600x400/009688/ffffff.png&text=Ear', 'tai', 'ear'),
(25, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=nose&type=2',
 'https://dummyimage.com/600x400/4CAF50/ffffff.png&text=Nose', 'mũi', 'nose'),
(26, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=mouth&type=2',
 'https://dummyimage.com/600x400/8BC34A/ffffff.png&text=Mouth', 'miệng', 'mouth'),
(27, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=hand&type=2',
 'https://dummyimage.com/600x400/CDDC39/000000.png&text=Hand', 'bàn tay', 'hand'),
(28, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=arm&type=2',
 'https://dummyimage.com/600x400/FFEB3B/000000.png&text=Arm', 'cánh tay', 'arm'),
(29, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=leg&type=2',
 'https://dummyimage.com/600x400/FFC107/000000.png&text=Leg', 'chân', 'leg'),
(30, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=foot&type=2',
 'https://dummyimage.com/600x400/FF9800/ffffff.png&text=Foot', 'bàn chân', 'foot'),
(31, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=hair&type=2',
 'https://dummyimage.com/600x400/FF5722/ffffff.png&text=Hair', 'tóc', 'hair'),
(32, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=tooth&type=2',
 'https://dummyimage.com/600x400/795548/ffffff.png&text=Tooth', 'răng', 'tooth'),
(33, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=tongue&type=2',
 'https://dummyimage.com/600x400/E91E63/ffffff.png&text=Tongue', 'lưỡi', 'tongue'),
(34, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=neck&type=2',
 'https://dummyimage.com/600x400/9C27B0/ffffff.png&text=Neck', 'cổ', 'neck'),
(35, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=shoulder&type=2',
 'https://dummyimage.com/600x400/673AB7/ffffff.png&text=Shoulder', 'vai', 'shoulder'),
(36, NOW(), 1, 0, NOW(), 1, 'https://dict.youdao.com/dictvoice?audio=knee&type=2',
 'https://dummyimage.com/600x400/3F51B5/ffffff.png&text=Knee', 'đầu gối', 'knee');

-- ------------------------------------------------------------
-- 5. PART_VOCABULARIES
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `part_id`, `vocabulary_id`)
VALUES
(1,  NOW(), 1, 0, NOW(), 1, 1,  1, 1),
(2,  NOW(), 1, 0, NOW(), 1, 2,  1, 2),
(3,  NOW(), 1, 0, NOW(), 1, 3,  1, 3),
(4,  NOW(), 1, 0, NOW(), 1, 4,  1, 4),
(5,  NOW(), 1, 0, NOW(), 1, 5,  1, 5),
(6,  NOW(), 1, 0, NOW(), 1, 6,  1, 6),
(7,  NOW(), 1, 0, NOW(), 1, 7,  1, 7),
(8,  NOW(), 1, 0, NOW(), 1, 8,  1, 8),
(9,  NOW(), 1, 0, NOW(), 1, 9,  1, 9),
(10, NOW(), 1, 0, NOW(), 1, 10, 1, 10),
(11, NOW(), 1, 0, NOW(), 1, 1,  2, 11),
(12, NOW(), 1, 0, NOW(), 1, 2,  2, 12),
(13, NOW(), 1, 0, NOW(), 1, 3,  2, 13),
(14, NOW(), 1, 0, NOW(), 1, 4,  2, 14),
(15, NOW(), 1, 0, NOW(), 1, 5,  2, 15),
(16, NOW(), 1, 0, NOW(), 1, 6,  2, 16),
(17, NOW(), 1, 0, NOW(), 1, 7,  2, 17),
(18, NOW(), 1, 0, NOW(), 1, 8,  2, 18),
(19, NOW(), 1, 0, NOW(), 1, 9,  2, 19),
(20, NOW(), 1, 0, NOW(), 1, 10, 2, 20),
(21, NOW(), 1, 0, NOW(), 1, 11, 2, 21),
(22, NOW(), 1, 0, NOW(), 1, 1, 3, 22),
(23, NOW(), 1, 0, NOW(), 1, 2, 3, 23),
(24, NOW(), 1, 0, NOW(), 1, 3, 3, 24),
(25, NOW(), 1, 0, NOW(), 1, 4, 3, 25),
(26, NOW(), 1, 0, NOW(), 1, 5, 3, 26),
(27, NOW(), 1, 0, NOW(), 1, 6, 3, 27),
(28, NOW(), 1, 0, NOW(), 1, 7, 3, 28),
(29, NOW(), 1, 0, NOW(), 1, 1, 4, 29),
(30, NOW(), 1, 0, NOW(), 1, 2, 4, 30),
(31, NOW(), 1, 0, NOW(), 1, 3, 4, 31),
(32, NOW(), 1, 0, NOW(), 1, 4, 4, 32),
(33, NOW(), 1, 0, NOW(), 1, 5, 4, 33),
(34, NOW(), 1, 0, NOW(), 1, 6, 4, 34),
(35, NOW(), 1, 0, NOW(), 1, 7, 4, 35),
(36, NOW(), 1, 0, NOW(), 1, 8, 4, 36);

-- ------------------------------------------------------------
-- 6. SESSIONS
--    Tất cả payload = NULL
-- ------------------------------------------------------------
INSERT INTO `sessions`
(`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES

-- ============================================================
-- PART 1: Number 1-10
-- ============================================================
(1, NOW(), 1, 0, NOW(), 1, NULL, 'Flashcard numbers 1-10', 'FLASHCARD', 1, NULL, 'Flashcard: Numbers 1-10', 1),
(2, NOW(), 1, 0, NOW(), 1, NULL, 'Match word numbers 1-10', 'MATCH_WORD', 2, NULL, 'Match Word: Numbers 1-10', 1),
(3, NOW(), 1, 0, NOW(), 1, NULL, 'Speaking numbers 1-10', 'SPEAKING', 3, NULL, 'Speaking: Numbers 1-10', 1),
(4, NOW(), 1, 0, NOW(), 1, NULL, 'Re-order numbers 1-10', 'RE_ORDER', 4, NULL, 'Re-order: Numbers 1-10', 1),
(5, NOW(), 1, 0, NOW(), 1, NULL, 'Drag drop numbers 1-10',    'DRAG_DROP',    5, NULL, 'Drag Drop: Numbers 1-10',    1),
(6, NOW(), 1, 0, NOW(), 1, NULL, 'Grammar numbers 1-10',      'GRAMMAR',      6, NULL, 'Grammar: Numbers 1-10',      1),
(7, NOW(), 1, 0, NOW(), 1, NULL, 'Conversation numbers 1-10', 'CONVERSATION', 7, NULL, 'Conversation: Numbers 1-10', 1),

-- ============================================================
-- PART 2: Number 10-20
-- ============================================================
(8,  NOW(), 1, 0, NOW(), 1, NULL, 'Flashcard numbers 10-20', 'FLASHCARD', 1, NULL, 'Flashcard: Numbers 10-20', 2),
(9,  NOW(), 1, 0, NOW(), 1, NULL, 'Match word numbers 10-20', 'MATCH_WORD', 2, NULL, 'Match Word: Numbers 10-20', 2),
(10, NOW(), 1, 0, NOW(), 1, NULL, 'Speaking numbers 10-20', 'SPEAKING', 3, NULL, 'Speaking: Numbers 10-20', 2),
(11, NOW(), 1, 0, NOW(), 1, NULL, 'Re-order numbers 10-20', 'RE_ORDER', 4, NULL, 'Re-order: Numbers 10-20', 2),
(12, NOW(), 1, 0, NOW(), 1, NULL, 'Drag drop numbers 10-20',    'DRAG_DROP',    5, NULL, 'Drag Drop: Numbers 10-20',    2),
(13, NOW(), 1, 0, NOW(), 1, NULL, 'Grammar numbers 10-20',      'GRAMMAR',      6, NULL, 'Grammar: Numbers 10-20',      2),
(14, NOW(), 1, 0, NOW(), 1, NULL, 'Conversation numbers 10-20', 'CONVERSATION', 7, NULL, 'Conversation: Numbers 10-20', 2),

-- ============================================================
-- PART 3: Body Parts 1
-- ============================================================
(15, NOW(), 1, 0, NOW(), 1, NULL, 'Flashcard body parts 1', 'FLASHCARD', 1, NULL, 'Flashcard: Body Parts 1', 3),
(16, NOW(), 1, 0, NOW(), 1, NULL, 'Match word body parts 1', 'MATCH_WORD', 2, NULL, 'Match Word: Body Parts 1', 3),
(17, NOW(), 1, 0, NOW(), 1, NULL, 'Speaking body parts 1', 'SPEAKING', 3, NULL, 'Speaking: Body Parts 1', 3),
(18, NOW(), 1, 0, NOW(), 1, NULL, 'Re-order body parts 1', 'RE_ORDER', 4, NULL, 'Re-order: Body Parts 1', 3),
(19, NOW(), 1, 0, NOW(), 1, NULL, 'Drag drop body parts 1',    'DRAG_DROP',    5, NULL, 'Drag Drop: Body Parts 1',    3),
(20, NOW(), 1, 0, NOW(), 1, NULL, 'Grammar body parts 1',      'GRAMMAR',      6, NULL, 'Grammar: Body Parts 1',      3),
(21, NOW(), 1, 0, NOW(), 1, NULL, 'Conversation body parts 1', 'CONVERSATION', 7, NULL, 'Conversation: Body Parts 1', 3),

-- ============================================================
-- PART 4: Body Parts 2
-- ============================================================
(22, NOW(), 1, 0, NOW(), 1, NULL, 'Flashcard body parts 2', 'FLASHCARD', 1, NULL, 'Flashcard: Body Parts 2', 4),
(23, NOW(), 1, 0, NOW(), 1, NULL, 'Match word body parts 2', 'MATCH_WORD', 2, NULL, 'Match Word: Body Parts 2', 4),
(24, NOW(), 1, 0, NOW(), 1, NULL, 'Speaking body parts 2', 'SPEAKING', 3, NULL, 'Speaking: Body Parts 2', 4),
(25, NOW(), 1, 0, NOW(), 1, NULL, 'Re-order body parts 2', 'RE_ORDER', 4, NULL, 'Re-order: Body Parts 2', 4),
(26, NOW(), 1, 0, NOW(), 1, NULL, 'Drag drop body parts 2',    'DRAG_DROP',    5, NULL, 'Drag Drop: Body Parts 2',    4),
(27, NOW(), 1, 0, NOW(), 1, NULL, 'Grammar body parts 2',      'GRAMMAR',      6, NULL, 'Grammar: Body Parts 2',      4),
(28, NOW(), 1, 0, NOW(), 1, NULL, 'Conversation body parts 2', 'CONVERSATION', 7, NULL, 'Conversation: Body Parts 2', 4);