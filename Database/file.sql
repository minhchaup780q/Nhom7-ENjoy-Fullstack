-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Ảnh & audio linh hoạt theo từng word
-- Chỉ giữ topic Number (chuẩn mẫu), đã xóa topic Body
-- Session 5: DRAG_DROP (payload đầy đủ)
-- Session 6: GRAMMAR (payload đầy đủ)
-- Session 7: FILL_IN_BLANK (payload đầy đủ)
-- Session 8: RE_ORDER_SENTENCE (payload đầy đủ)
-- Ảnh của topic Number đã được đưa vào folder /Number/ trên S3
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 1. LEVEL
-- ------------------------------------------------------------
INSERT INTO `levels` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `code`, `name`, `order_index`)
VALUES
(1, NOW(), 1, 0, NOW(), 1, 'PRE_A1', 'Pre A1 - Beginner', 1);

-- ------------------------------------------------------------
-- 2. TOPICS (chỉ còn Number)
-- ------------------------------------------------------------
INSERT INTO `topics` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(1, NOW(), 1, 0, NOW(), 1, 'Numbers from 1 to 20', 1,
 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
 'Number', 1);

-- ------------------------------------------------------------
-- 3. PARTS (chỉ còn 2 part thuộc Number)
-- ------------------------------------------------------------
INSERT INTO `parts` (`id`, `create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `order_index`, `title`, `topic_id`)
VALUES
(1, NOW(), 1, 0, NOW(), 1, 1, 'Number 1-10', 1),
(2, NOW(), 1, 0, NOW(), 1, 2, 'Number 10-20', 1);

-- ------------------------------------------------------------
-- 4. VOCABULARIES (chỉ còn vocab của Number 1-20)
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
 'https://dummyimage.com/600x400/2196F3/ffffff.png&text=20+-+Twenty', 'hai mươi', 'twenty');

-- ------------------------------------------------------------
-- 5. PART_VOCABULARIES (chỉ còn 2 part)
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
(21, NOW(), 1, 0, NOW(), 1, 11, 2, 21);

-- ------------------------------------------------------------
-- 6. SESSIONS
--    Part 1: Number 1-10  (8 vòng, vòng 5-8 có payload)
--    Part 2: Number 10-20 (7 vòng, payload = NULL)
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

-- Vòng 5: DRAG_DROP
(5, NOW(), 1, 0, NOW(), 1, NULL, 'Drag drop numbers 1-10', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/number.jpg',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=one&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','one',   'x',0.2949,'y',0.8578,'width',0.0762,'height',0.0405),
    JSON_OBJECT('word','two',   'x',0.0737,'y',0.5263,'width',0.0937,'height',0.046),
    JSON_OBJECT('word','three', 'x',0.7162,'y',0.7584,'width',0.0775,'height',0.0405),
    JSON_OBJECT('word','four',  'x',0.8549,'y',0.6166,'width',0.0637,'height',0.0387),
    JSON_OBJECT('word','seven', 'x',0.8587,'y',0.8744,'width',0.0575,'height',0.0313),
    JSON_OBJECT('word','ten',   'x',0.4287,'y',0.3477,'width',0.0825,'height',0.046),
    JSON_OBJECT('word','five',  'x',0.2174,'y',0.5281,'width',0.0675,'height',0.046),
    JSON_OBJECT('word','eight', 'x',0.1662,'y',0.2998,'width',0.0787,'height',0.0387),
    JSON_OBJECT('word','six',   'x',0.5712,'y',0.0751,'width',0.0787,'height',0.0424),
    JSON_OBJECT('word','nine',  'x',0.8649,'y',0.2924,'width',0.0675,'height',0.0442)
  )
), 'Drag Drop: Numbers 1-10', 1),

-- Vòng 6: GRAMMAR
(6, NOW(), 1, 0, NOW(), 1, NULL, 'Grammar numbers 1-10', 'GRAMMAR', 6,
 JSON_OBJECT(
  'title', 'Grammar: Greetings, Names & Age',
  'blocks', JSON_ARRAY(
    JSON_OBJECT('order', 1,  'type', 'TEXT_SPEECH',  'text', 'Let''s learn grammar!', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Let''s+learn+grammar!&type=2'),
    JSON_OBJECT('order', 2,  'type', 'IMAGE',        'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/hihello.webp'),
    JSON_OBJECT('order', 3,  'type', 'EXPLANATION',  'text', 'When you greet someone, you say "Hi" or "Hello".'),
    JSON_OBJECT('order', 4,  'type', 'IMAGE',        'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/3name.webp'),
    JSON_OBJECT('order', 5,  'type', 'EXPLANATION',  'text', '"Name" is what people call you.'),
    JSON_OBJECT('order', 6,  'type', 'IMAGE',        'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/h1.webp'),
    JSON_OBJECT('order', 7,  'type', 'EXPLANATION',  'text', 'When someone asks your name, they say: "What''s your name?" or "What is your name?".'),
    JSON_OBJECT('order', 8,  'type', 'EXPLANATION',  'text', 'You say: "My name is" + [your name] OR "I''m" + [your name].'),
    JSON_OBJECT('order', 9,  'type', 'IMAGE',        'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/h2.webp'),
    JSON_OBJECT('order', 10, 'type', 'EXPLANATION',  'text', 'When someone asks your age, they say: "How old are you?".'),
    JSON_OBJECT('order', 11, 'type', 'EXPLANATION',  'text', 'You say: "I''m/I am" + your age number. You can say "years old" at the end or not.'),
    JSON_OBJECT('order', 12, 'type', 'TEXT_SPEECH',  'text', 'Now listen and choose!', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Now+listen+and+choose!&type=2'),
    JSON_OBJECT('order', 13, 'type', 'QUESTION', 'text', 'Hi, [] Mymy.',    'audio_url', 'https://dict.youdao.com/dictvoice?audio=Hi,+I''m+Mymy.&type=2',         'options', JSON_ARRAY(JSON_OBJECT('id','opt_1','text','I''m',    'is_correct',TRUE), JSON_OBJECT('id','opt_2','text','My',      'is_correct',FALSE))),
    JSON_OBJECT('order', 14, 'type', 'QUESTION', 'text', '[] your name?',   'audio_url', 'https://dict.youdao.com/dictvoice?audio=What''s+your+name?&type=2',    'options', JSON_ARRAY(JSON_OBJECT('id','opt_1','text','What''s','is_correct',TRUE), JSON_OBJECT('id','opt_2','text','How',     'is_correct',FALSE))),
    JSON_OBJECT('order', 15, 'type', 'QUESTION', 'text', 'My [] is Kin.',   'audio_url', 'https://dict.youdao.com/dictvoice?audio=My+name+is+Kin.&type=2',       'options', JSON_ARRAY(JSON_OBJECT('id','opt_1','text','name',   'is_correct',TRUE), JSON_OBJECT('id','opt_2','text','am',      'is_correct',FALSE))),
    JSON_OBJECT('order', 16, 'type', 'QUESTION', 'text', '[] old are you?', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=How+old+are+you?&type=2',      'options', JSON_ARRAY(JSON_OBJECT('id','opt_1','text','How',    'is_correct',TRUE), JSON_OBJECT('id','opt_2','text','What',    'is_correct',FALSE)))
  )
), 'Grammar: Numbers 1-10', 1),

-- Vòng 7: FILL_IN_BLANK
(7, NOW(), 1, 0, NOW(), 1, NULL, 'Fill in blank numbers 1-10', 'FILL_IN_BLANK', 7,
 JSON_OBJECT(
  'title', 'Fill in Blank: Numbers 1-10',
  'items', JSON_ARRAY(
    JSON_OBJECT(
      'order', 1,
      'sentence', 'I''m [nine] years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_nine.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+nine+years+old&type=2',
      'answer', 'nine',
      'distractors', JSON_ARRAY('six', 'ten')
    ),
    JSON_OBJECT(
      'order', 2,
      'sentence', 'I''m [eight] years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_eight.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+eight+years+old&type=2',
      'answer', 'eight',
      'distractors', JSON_ARRAY('six', 'ten')
    ),
    JSON_OBJECT(
      'order', 3,
      'sentence', 'I''m [one] years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_one.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+one+years+old&type=2',
      'answer', 'one',
      'distractors', JSON_ARRAY('two', 'five')
    ),
    JSON_OBJECT(
      'order', 4,
      'sentence', 'I''m [two] years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_two.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+two+years+old&type=2',
      'answer', 'two',
      'distractors', JSON_ARRAY('three', 'four')
    ),
    JSON_OBJECT(
      'order', 5,
      'sentence', 'I''m [five] years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_five.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+five+years+old&type=2',
      'answer', 'five',
      'distractors', JSON_ARRAY('three', 'four')
    ),
    JSON_OBJECT(
      'order', 6,
      'sentence', 'I''m [seven] years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_seven.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+seven+years+old&type=2',
      'answer', 'seven',
      'distractors', JSON_ARRAY('four', 'nine')
    )
  )
), 'Fill in Blank: Numbers 1-10', 1),

-- Vòng 8: RE_ORDER_SENTENCE
(8, NOW(), 1, 0, NOW(), 1, NULL, 'Re-order sentence numbers 1-10', 'RE_ORDER_SENTENCE', 8,
 JSON_OBJECT(
  'title', 'Re-order Sentence: Numbers 1-10',
  'items', JSON_ARRAY(
    JSON_OBJECT(
      'order', 1,
      'sentence', 'I''m nine years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_nine.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+nine+years+old&type=2'
    ),
    JSON_OBJECT(
      'order', 2,
      'sentence', 'I''m eight years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_eight.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+eight+years+old&type=2'
    ),
    JSON_OBJECT(
      'order', 3,
      'sentence', 'I''m one years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_one.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+one+years+old&type=2'
    ),
    JSON_OBJECT(
      'order', 4,
      'sentence', 'I''m two years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_two.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+two+years+old&type=2'
    ),
    JSON_OBJECT(
      'order', 5,
      'sentence', 'I''m five years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_five.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+five+years+old&type=2'
    ),
    JSON_OBJECT(
      'order', 6,
      'sentence', 'I''m seven years old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_seven.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+seven+years+old&type=2'
    ),
    JSON_OBJECT(
      'order', 7,
      'sentence', 'What is your name?',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/re_order_sentence_what_is_your_name.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=What+is+your+name%3F&type=2'
    ),
    JSON_OBJECT(
      'order', 8,
      'sentence', 'Hello, I''m John!',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/re_order_sentence_hello_im_john.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Hello%2C+I%27m+John%21&type=2'
    ),
    JSON_OBJECT(
      'order', 9,
      'sentence', 'Hi, I''m John',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/re_order_sentence_hi_im_john.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Hi%2C+I%27m+John&type=2'
    ),
    JSON_OBJECT(
      'order', 10,
      'sentence', 'My name is John',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/re_order_sentence_my_name_is_john.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=My+name+is+John&type=2'
    ),
    JSON_OBJECT(
      'order', 11,
      'sentence', 'How old are you?',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/re_order_sentence_how_old_are_you.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=How+old+are+you%3F&type=2'
    )
  )
), 'Re-order Sentence: Numbers 1-10', 1),

-- ============================================================
-- PART 2: Number 10-20
-- ============================================================
(9,  NOW(), 1, 0, NOW(), 1, NULL, 'Flashcard numbers 10-20', 'FLASHCARD', 1, NULL, 'Flashcard: Numbers 10-20', 2),
(10, NOW(), 1, 0, NOW(), 1, NULL, 'Match word numbers 10-20', 'MATCH_WORD', 2, NULL, 'Match Word: Numbers 10-20', 2),
(11, NOW(), 1, 0, NOW(), 1, NULL, 'Speaking numbers 10-20', 'SPEAKING', 3, NULL, 'Speaking: Numbers 10-20', 2),
(12, NOW(), 1, 0, NOW(), 1, NULL, 'Re-order numbers 10-20', 'RE_ORDER', 4, NULL, 'Re-order: Numbers 10-20', 2),
(13, NOW(), 1, 0, NOW(), 1, NULL, 'Drag drop numbers 10-20', 'DRAG_DROP', 5, NULL, 'Drag Drop: Numbers 10-20', 2),
(14, NOW(), 1, 0, NOW(), 1, NULL, 'Grammar numbers 10-20', 'GRAMMAR', 6, NULL, 'Grammar: Numbers 10-20', 2),
(15, NOW(), 1, 0, NOW(), 1, NULL, 'Fill in blank numbers 10-20', 'FILL_IN_BLANK', 7, NULL, 'Fill in Blank: Numbers 10-20', 2);

-- ============================================================
-- 7. RESET AUTO_INCREMENT (tuỳ chọn, để id sạch)
-- ============================================================
ALTER TABLE `levels`            AUTO_INCREMENT = 2;
ALTER TABLE `topics`            AUTO_INCREMENT = 2;
ALTER TABLE `parts`             AUTO_INCREMENT = 3;
ALTER TABLE `vocabularies`      AUTO_INCREMENT = 22;
ALTER TABLE `part_vocabularies` AUTO_INCREMENT = 22;
ALTER TABLE `sessions`          AUTO_INCREMENT = 16;