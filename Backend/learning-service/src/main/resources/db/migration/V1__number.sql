-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Number (chỉ còn Part 1: Number 1-10)
-- Áp dụng cơ chế AUTO_INCREMENT + LAST_INSERT_ID() cho toàn bộ file
-- Session 5: DRAG_DROP
-- Session 6: GRAMMAR
-- Session 7: FILL_IN_BLANK
-- Session 8: RE_ORDER_SENTENCE
-- Session 9: SPEAKING_SENTENCE (payload giống hệt session 8)
-- Session 10: CONVERSATION
-- Ảnh của topic Number đã được đưa vào folder /Number/ trên S3
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 1. LEVEL
-- ------------------------------------------------------------
INSERT INTO `levels`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`, `code`, `name`, `order_index`)
VALUES
(NOW(), 1, 0, NOW(), 1, 'PRE_A1', 'Pre A1 - Beginner', 1);

SET @level_pre_a1 := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 2. TOPIC: Number
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Numbers from 1 to 20', 1,
 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
 'Number', @level_pre_a1);

SET @topic_number := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 3. PART: Number 1-10 (duy nhất)
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Number 1-10', @topic_number);

SET @part_number_1_10 := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. VOCABULARIES (Numbers 1-10)
--    Mỗi vocab chèn riêng để lấy được id qua LAST_INSERT_ID()
-- ------------------------------------------------------------

-- one
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=one&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/flashcard_one.webp',
 'một', 'one');
SET @v_one := LAST_INSERT_ID();

-- two
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=two&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/flashcard_two.webp',
 'hai', 'two');
SET @v_two := LAST_INSERT_ID();

-- three
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=three&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/flashcard_three.webp',
 'ba', 'three');
SET @v_three := LAST_INSERT_ID();

-- four
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=four&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/flashcard_four.webp',
 'bốn', 'four');
SET @v_four := LAST_INSERT_ID();

-- five
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=five&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/flashcard_five.webp',
 'năm', 'five');
SET @v_five := LAST_INSERT_ID();

-- six
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=six&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/flashcard_six.webp',
 'sáu', 'six');
SET @v_six := LAST_INSERT_ID();

-- seven
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=seven&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/flashcard_seven.webp',
 'bảy', 'seven');
SET @v_seven := LAST_INSERT_ID();

-- eight
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=eight&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/flashcard_eight.webp',
 'tám', 'eight');
SET @v_eight := LAST_INSERT_ID();

-- nine
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=nine&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/flashcard_nine.webp',
 'chín', 'nine');
SET @v_nine := LAST_INSERT_ID();

-- ten
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=ten&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/flashcard_ten.webp',
 'mười', 'ten');
SET @v_ten := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 5. PART_VOCABULARIES (nối part Number 1-10 với 10 vocab)
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_number_1_10, @v_one),
(NOW(), 1, 0, NOW(), 1, 2,  @part_number_1_10, @v_two),
(NOW(), 1, 0, NOW(), 1, 3,  @part_number_1_10, @v_three),
(NOW(), 1, 0, NOW(), 1, 4,  @part_number_1_10, @v_four),
(NOW(), 1, 0, NOW(), 1, 5,  @part_number_1_10, @v_five),
(NOW(), 1, 0, NOW(), 1, 6,  @part_number_1_10, @v_six),
(NOW(), 1, 0, NOW(), 1, 7,  @part_number_1_10, @v_seven),
(NOW(), 1, 0, NOW(), 1, 8,  @part_number_1_10, @v_eight),
(NOW(), 1, 0, NOW(), 1, 9,  @part_number_1_10, @v_nine),
(NOW(), 1, 0, NOW(), 1, 10, @part_number_1_10, @v_ten);

-- ------------------------------------------------------------
-- 6. SESSIONS (10 vòng, đều thuộc part Number 1-10)
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard numbers 1-10', 'FLASHCARD', 1, NULL,
 'Flashcard: Numbers 1-10', @part_number_1_10);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word numbers 1-10', 'MATCH_WORD', 2, NULL,
 'Match Word: Numbers 1-10', @part_number_1_10);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking numbers 1-10', 'SPEAKING', 3, NULL,
 'Speaking: Numbers 1-10', @part_number_1_10);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order numbers 1-10', 'RE_ORDER', 4, NULL,
 'Re-order: Numbers 1-10', @part_number_1_10);

-- Vòng 5: DRAG_DROP
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop numbers 1-10', 'DRAG_DROP', 5,
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
),
 'Drag Drop: Numbers 1-10', @part_number_1_10);

-- Vòng 6: GRAMMAR
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Grammar numbers 1-10', 'GRAMMAR', 6,
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
),
 'Grammar: Numbers 1-10', @part_number_1_10);

-- Vòng 7: FILL_IN_BLANK
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Fill in blank numbers 1-10', 'FILL_IN_BLANK', 7,
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
      'sentence', 'I''m [one] year old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_one.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+one+year+old&type=2',
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
),
 'Fill in Blank: Numbers 1-10', @part_number_1_10);

-- Vòng 8: RE_ORDER_SENTENCE
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order sentence numbers 1-10', 'RE_ORDER_SENTENCE', 8,
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
      'sentence', 'I''m one year old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_one.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+one+year+old&type=2'
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
),
 'Re-order Sentence: Numbers 1-10', @part_number_1_10);

-- Vòng 9: SPEAKING_SENTENCE (data giống hệt vòng 8)
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking sentence numbers 1-10', 'SPEAKING_SENTENCE', 9,
 JSON_OBJECT(
  'title', 'Speaking Sentence: Numbers 1-10',
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
      'sentence', 'I''m one year old',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Number/grammar_fill_in_blank_one.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+one+year+old&type=2'
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
),
 'Speaking Sentence: Numbers 1-10', @part_number_1_10);

-- Vòng 10: CONVERSATION
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Conversation numbers 1-10', 'CONVERSATION', 10,
 JSON_OBJECT(
  'title', 'Conversation: Numbers 1-10',
  'items', JSON_ARRAY(
    JSON_OBJECT(
      'order', 1,
      'question',   JSON_OBJECT('type', 'question',   'text', 'Hi',    'audio_url', 'https://dict.youdao.com/dictvoice?audio=Hi&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'Hello!', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Hello%21&type=2',            'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'One apple!', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=One+apple%21&type=2',        'is_correct', FALSE)
    ),
    JSON_OBJECT(
      'order', 2,
      'question',   JSON_OBJECT('type', 'question',   'text', 'Hi, what''s your name?',               'audio_url', 'https://dict.youdao.com/dictvoice?audio=Hi%2C+what%27s+your+name%3F&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'My name is Casi',                      'audio_url', 'https://dict.youdao.com/dictvoice?audio=My+name+is+Casi&type=2',      'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'What is my name?',                     'audio_url', 'https://dict.youdao.com/dictvoice?audio=What+is+my+name%3F&type=2',   'is_correct', FALSE)
    ),
    JSON_OBJECT(
      'order', 3,
      'question',   JSON_OBJECT('type', 'question',   'text', 'I''m John. What''s is your name?',     'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+John.+What%27s+is+your+name%3F&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'I''m Summer',                          'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+Summer&type=2',        'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'Yes, I am',                            'audio_url', 'https://dict.youdao.com/dictvoice?audio=Yes%2C+I+am&type=2',          'is_correct', FALSE)
    ),
    JSON_OBJECT(
      'order', 4,
      'question',   JSON_OBJECT('type', 'question',   'text', 'How old are you, Mymy?',               'audio_url', 'https://dict.youdao.com/dictvoice?audio=How+old+are+you%2C+Mymy%3F&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'I''m nine years old',                  'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+nine+years+old&type=2',  'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'Thank you.',                           'audio_url', 'https://dict.youdao.com/dictvoice?audio=Thank+you.&type=2',           'is_correct', FALSE)
    ),
    JSON_OBJECT(
      'order', 5,
      'question',   JSON_OBJECT('type', 'question',   'text', 'I''m ten years old. How old are you?', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+ten+years+old.+How+old+are+you%3F&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'I''m ten!',                            'audio_url', 'https://dict.youdao.com/dictvoice?audio=I%27m+ten%21&type=2',         'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'No, I''m fine',                        'audio_url', 'https://dict.youdao.com/dictvoice?audio=No%2C+I%27m+fine&type=2',      'is_correct', FALSE)
    )
  )
),
 'Conversation: Numbers 1-10', @part_number_1_10);

-- ============================================================
-- 7. KHÔNG reset AUTO_INCREMENT
--    (để MySQL tự quản lý, tránh trùng id khi chạy nhiều file seed)
-- ============================================================