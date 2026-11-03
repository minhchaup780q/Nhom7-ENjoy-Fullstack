-- ============================================================
-- SAMPLE DATA FOR enjoy_learning_db
-- Topic: Classroom (Classroom objects & prepositions)
-- File thứ 3 — nối tiếp seed_01_number.sql, seed_02_color.sql
-- Áp dụng AUTO_INCREMENT + LAST_INSERT_ID()
-- Audio: dict.youdao.com theo từng word / câu
-- Ảnh: /session-items/Classroom/<name>.webp trên S3
--       (một số ảnh vòng 7-10 là placeholder, sẽ update sau)
--
-- Sessions:
--   Vòng 1: FLASHCARD
--   Vòng 2: MATCH_WORD
--   Vòng 3: SPEAKING
--   Vòng 4: RE_ORDER
--   Vòng 5: DRAG_DROP
--   Vòng 6: GRAMMAR
--   Vòng 7: FILL_IN_BLANK
--   Vòng 8: RE_ORDER_SENTENCE
--   Vòng 9: SPEAKING_SENTENCE
--   Vòng 10: CONVERSATION
-- ============================================================

USE `enjoy_learning_db`;

-- ------------------------------------------------------------
-- 1. TOPIC: Classroom
-- ------------------------------------------------------------
INSERT INTO `topics`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `description`, `order_index`, `thumbnail_url`, `title`, `level_id`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'Classroom objects and prepositions', 3,
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/classroom.webp',
 'Classroom', 1);

SET @topic_classroom := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 2. PART: Classroom
-- ------------------------------------------------------------
INSERT INTO `parts`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `title`, `topic_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1, 'Classroom', @topic_classroom);

SET @part_classroom := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 3. VOCABULARIES (11 từ)
-- ------------------------------------------------------------

-- classroom
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=classroom&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/classroom.webp',
 'lớp học', 'classroom');
SET @v_classroom := LAST_INSERT_ID();

-- rubber
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=rubber&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/rubber.webp',
 'cục tẩy', 'rubber');
SET @v_rubber := LAST_INSERT_ID();

-- pencil
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=pencil&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/pencil.webp',
 'bút chì', 'pencil');
SET @v_pencil := LAST_INSERT_ID();

-- crayon
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=crayon&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/crayon.webp',
 'bút sáp màu', 'crayon');
SET @v_crayon := LAST_INSERT_ID();

-- bag
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=bag&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/bag.webp',
 'cặp sách', 'bag');
SET @v_bag := LAST_INSERT_ID();

-- teacher
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=teacher&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/teacher.webp',
 'giáo viên', 'teacher');
SET @v_teacher := LAST_INSERT_ID();

-- desk
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=desk&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/desk.webp',
 'bàn học', 'desk');
SET @v_desk := LAST_INSERT_ID();

-- chair
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=chair&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/chair.webp',
 'cái ghế', 'chair');
SET @v_chair := LAST_INSERT_ID();

-- book
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=book&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/book.webp',
 'quyển sách', 'book');
SET @v_book := LAST_INSERT_ID();

-- pen
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=pen&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/pen.webp',
 'bút mực', 'pen');
SET @v_pen := LAST_INSERT_ID();

-- pencil case
INSERT INTO `vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `audio_url`, `image_url`, `translation`, `word`)
VALUES
(NOW(), 1, 0, NOW(), 1,
 'https://dict.youdao.com/dictvoice?audio=pencil+case&type=2',
 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/pencil_case.webp',
 'hộp bút', 'pencil case');
SET @v_pencil_case := LAST_INSERT_ID();

-- ------------------------------------------------------------
-- 4. PART_VOCABULARIES
-- ------------------------------------------------------------
INSERT INTO `part_vocabularies`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `order_index`, `part_id`, `vocabulary_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, 1,  @part_classroom, @v_classroom),
(NOW(), 1, 0, NOW(), 1, 2,  @part_classroom, @v_rubber),
(NOW(), 1, 0, NOW(), 1, 3,  @part_classroom, @v_pencil),
(NOW(), 1, 0, NOW(), 1, 4,  @part_classroom, @v_crayon),
(NOW(), 1, 0, NOW(), 1, 5,  @part_classroom, @v_bag),
(NOW(), 1, 0, NOW(), 1, 6,  @part_classroom, @v_teacher),
(NOW(), 1, 0, NOW(), 1, 7,  @part_classroom, @v_desk),
(NOW(), 1, 0, NOW(), 1, 8,  @part_classroom, @v_chair),
(NOW(), 1, 0, NOW(), 1, 9,  @part_classroom, @v_book),
(NOW(), 1, 0, NOW(), 1, 10, @part_classroom, @v_pen),
(NOW(), 1, 0, NOW(), 1, 11, @part_classroom, @v_pencil_case);

-- ------------------------------------------------------------
-- 5. SESSIONS
-- ------------------------------------------------------------

-- Vòng 1: FLASHCARD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Flashcard classroom', 'FLASHCARD', 1, NULL,
 'Flashcard: Classroom', @part_classroom);

-- Vòng 2: MATCH_WORD
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Match word classroom', 'MATCH_WORD', 2, NULL,
 'Match Word: Classroom', @part_classroom);

-- Vòng 3: SPEAKING
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking classroom', 'SPEAKING', 3, NULL,
 'Speaking: Classroom', @part_classroom);

-- Vòng 4: RE_ORDER
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order classroom', 'RE_ORDER', 4, NULL,
 'Re-order: Classroom', @part_classroom);

-- Vòng 5: DRAG_DROP (placeholder coordinates, update sau)
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Drag drop classroom', 'DRAG_DROP', 5,
 JSON_OBJECT(
  'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/classroom.jpg',
  'audio_url', 'https://dict.youdao.com/dictvoice?audio=classroom&type=2',
  'coordinates', JSON_ARRAY(
    JSON_OBJECT('word','classroom',   'x',0.1000,'y',0.1000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','rubber',      'x',0.2500,'y',0.1000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','pencil',      'x',0.4000,'y',0.1000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','crayon',      'x',0.5500,'y',0.1000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','bag',         'x',0.7000,'y',0.1000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','teacher',     'x',0.1000,'y',0.3000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','desk',        'x',0.2500,'y',0.3000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','chair',       'x',0.4000,'y',0.3000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','book',        'x',0.5500,'y',0.3000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','pen',         'x',0.7000,'y',0.3000,'width',0.0800,'height',0.0400),
    JSON_OBJECT('word','pencil case', 'x',0.4000,'y',0.5000,'width',0.1000,'height',0.0400)
  )
),
 'Drag Drop: Classroom', @part_classroom);

-- Vòng 6: GRAMMAR (data từ file JSON_OBJECT.txt)
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Grammar classroom', 'GRAMMAR', 6,
 JSON_OBJECT(
  'title', 'Grammar: Where is it?',
  'blocks', JSON_ARRAY(
    JSON_OBJECT('order', 1,  'type', 'TEXT_SPEECH',  'text', 'Let''s learn grammar!', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Let''s+learn+grammar!&type=2'),
    JSON_OBJECT('order', 2,  'type', 'TEXT_SPEECH',  'text', 'Look at the yellow crayon! Can you find it?', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Look+at+the+yellow+crayon!+Can+you+find+it?&type=2'),
    JSON_OBJECT('order', 3,  'type', 'IMAGE',        'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/grammar_placeholder.webp'),
    JSON_OBJECT('order', 4,  'type', 'EXPLANATION',  'text', '"next to", "on", "in" and "under" tell us where it is.'),
    JSON_OBJECT('order', 5,  'type', 'TEXT_SPEECH',  'text', 'We can say:', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=We+can+say:&type=2'),
    JSON_OBJECT('order', 6,  'type', 'EXPLANATION',  'text', 'The crayon is next to the rubber. = It is next to the rubber. = It''s next to the rubber.'),
    JSON_OBJECT('order', 7,  'type', 'EXPLANATION',  'text', 'The crayon isn''t on the rubber. = It isn''t on the rubber. = It is not on the rubber.'),
    JSON_OBJECT('order', 8,  'type', 'TEXT_SPEECH',  'text', 'If you have 2 or more crayons, use "they" and "are".', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=If+you+have+2+or+more+crayons,+use+"they"+and+"are".&type=2'),
    JSON_OBJECT('order', 9,  'type', 'EXPLANATION',  'text', 'The crayons are next to the rubber. = They are next to the rubber. = They''re next to the rubber.'),
    JSON_OBJECT('order', 10, 'type', 'EXPLANATION',  'text', 'The crayons aren''t on the rubber. = They aren''t on the rubber. = They are not on the rubber.'),
    JSON_OBJECT('order', 11, 'type', 'TEXT_SPEECH',  'text', 'Quick check! Choose the correct words.', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Quick+check!+Choose+the+correct+words.&type=2'),
    JSON_OBJECT('order', 12, 'type', 'QUESTION',     'text', 'The crayon [] next to the rubber.', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=The+crayon+is+next+to+the+rubber.&type=2', 'options', JSON_ARRAY(JSON_OBJECT('id','opt_1','text','is', 'is_correct',TRUE), JSON_OBJECT('id','opt_2','text','are', 'is_correct',FALSE))),
    JSON_OBJECT('order', 13, 'type', 'QUESTION',     'text', 'The crayons [] on the rubber.', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=The+crayons+aren''t+on+the+rubber.&type=2', 'options', JSON_ARRAY(JSON_OBJECT('id','opt_1','text','aren''t', 'is_correct',TRUE), JSON_OBJECT('id','opt_2','text','isn''t', 'is_correct',FALSE))),
    JSON_OBJECT('order', 14, 'type', 'TEXT_SPEECH',  'text', 'Next, we use "where" to ask about the place.', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Next,+we+use+"where"+to+ask+about+the+place.&type=2'),
    JSON_OBJECT('order', 15, 'type', 'IMAGE',        'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/grammar_placeholder.webp'),
    JSON_OBJECT('order', 16, 'type', 'EXPLANATION',  'text', 'Where is the crayon? It''s next to the rubber.'),
    JSON_OBJECT('order', 17, 'type', 'EXPLANATION',  'text', 'Where are the crayons? They''re next to the rubber.'),
    JSON_OBJECT('order', 18, 'type', 'TEXT_SPEECH',  'text', 'Quick check! Choose the correct words.', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Quick+check!+Choose+the+correct+words.&type=2'),
    JSON_OBJECT('order', 19, 'type', 'QUESTION',     'text', '[] is the crayon?', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where+is+the+crayon?&type=2', 'options', JSON_ARRAY(JSON_OBJECT('id','opt_1','text','Where', 'is_correct',TRUE), JSON_OBJECT('id','opt_2','text','What', 'is_correct',FALSE))),
    JSON_OBJECT('order', 20, 'type', 'IMAGE',        'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/grammar_placeholder.webp'),
    JSON_OBJECT('order', 21, 'type', 'EXPLANATION',  'text', 'Is the crayon next to the rubber? Yes, it is. / Is the crayon on the rubber? No, it isn''t.'),
    JSON_OBJECT('order', 22, 'type', 'EXPLANATION',  'text', 'Are the crayons next to the rubber? Yes, they are. / Are the crayons on the rubber? No, they aren''t.'),
    JSON_OBJECT('order', 23, 'type', 'TEXT_SPEECH',  'text', 'You ask Yes/No questions to be sure where the crayon is.', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=You+ask+Yes/No+questions+to+be+sure+where+the+crayon+is.&type=2'),
    JSON_OBJECT('order', 24, 'type', 'TEXT_SPEECH',  'text', 'Quick check! Look and choose.', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Quick+check!+Look+and+choose.&type=2'),
    JSON_OBJECT('order', 25, 'type', 'IMAGE',        'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/grammar_placeholder.webp'),
    JSON_OBJECT('order', 26, 'type', 'QUESTION',     'text', 'Is the crayon on the rubber?', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Is+the+crayon+on+the+rubber?&type=2', 'options', JSON_ARRAY(JSON_OBJECT('id','opt_1','text','No, it isn''t.', 'is_correct',TRUE), JSON_OBJECT('id','opt_2','text','Yes, it is.', 'is_correct',FALSE))),
    JSON_OBJECT('order', 27, 'type', 'IMAGE',        'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/grammar_placeholder.webp'),
    JSON_OBJECT('order', 28, 'type', 'QUESTION',     'text', 'Are the crayons next to the rubber?', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Are+the+crayons+next+to+the+rubber?&type=2', 'options', JSON_ARRAY(JSON_OBJECT('id','opt_1','text','Yes, they are.', 'is_correct',TRUE), JSON_OBJECT('id','opt_2','text','No, they aren''t.', 'is_correct',FALSE)))
  )
),
 'Grammar: Where is it?', @part_classroom);

-- Vòng 7: FILL_IN_BLANK
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Fill in blank classroom', 'FILL_IN_BLANK', 7,
 JSON_OBJECT(
  'title', 'Fill in Blank: Classroom',
  'items', JSON_ARRAY(
    JSON_OBJECT(
      'order', 1,
      'sentence', 'Where [is] the crayon?',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_01.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where+is+the+crayon%3F&type=2',
      'answer', 'is',
      'distractors', JSON_ARRAY('isn''t', 'are')
    ),
    JSON_OBJECT(
      'order', 2,
      'sentence', 'The crayon is [yellow].',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_02.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=The+crayon+is+yellow.&type=2',
      'answer', 'yellow',
      'distractors', JSON_ARRAY('brown', 'blue')
    ),
    JSON_OBJECT(
      'order', 3,
      'sentence', 'The crayon is [on] the desk.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_03.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=The+crayon+is+on+the+desk.&type=2',
      'answer', 'on',
      'distractors', JSON_ARRAY('in', 'next to')
    ),
    JSON_OBJECT(
      'order', 4,
      'sentence', 'It isn''t [in] the pencil case.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_04.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=It+isn%27t+in+the+pencil+case.&type=2',
      'answer', 'in',
      'distractors', JSON_ARRAY('on', 'under')
    ),
    JSON_OBJECT(
      'order', 5,
      'sentence', 'It isn''t [under] the book.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_05.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=It+isn%27t+under+the+book.&type=2',
      'answer', 'under',
      'distractors', JSON_ARRAY('in', 'on')
    ),
    JSON_OBJECT(
      'order', 6,
      'sentence', 'The rubber is [next to] the crayon.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_06.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=The+rubber+is+next+to+the+crayon.&type=2',
      'answer', 'next to',
      'distractors', JSON_ARRAY('on', 'in')
    ),
    JSON_OBJECT(
      'order', 7,
      'sentence', 'The teacher is [next to] the chair.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_07.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=The+teacher+is+next+to+the+chair.&type=2',
      'answer', 'next to',
      'distractors', JSON_ARRAY('under', 'in')
    ),
    JSON_OBJECT(
      'order', 8,
      'sentence', 'Where is Andy? - He is [in] the classroom.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_08.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where+is+Andy%3F+-+He+is+in+the+classroom.&type=2',
      'answer', 'in',
      'distractors', JSON_ARRAY('on', 'under')
    ),
    JSON_OBJECT(
      'order', 9,
      'sentence', 'Where is the pen? - It''s [on] the chair.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_09.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where+is+the+pen%3F+-+It%27s+on+the+chair.&type=2',
      'answer', 'on',
      'distractors', JSON_ARRAY('next to', 'in')
    ),
    JSON_OBJECT(
      'order', 10,
      'sentence', 'Where are the books? - They [are] on the desk.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_10.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where+are+the+books%3F+-+They+are+on+the+desk.&type=2',
      'answer', 'are',
      'distractors', JSON_ARRAY('aren''t', 'is')
    ),
    JSON_OBJECT(
      'order', 11,
      'sentence', 'Is the rubber [next to] the book? - Yes, it is.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_11.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Is+the+rubber+next+to+the+book%3F+-+Yes%2C+it+is.&type=2',
      'answer', 'next to',
      'distractors', JSON_ARRAY('on', 'in')
    ),
    JSON_OBJECT(
      'order', 12,
      'sentence', 'Are the crayons [in] the pencil case? - Yes, they are.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/fill_blank_12.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Are+the+crayons+in+the+pencil+case%3F+-+Yes%2C+they+are.&type=2',
      'answer', 'in',
      'distractors', JSON_ARRAY('under', 'on')
    )
  )
),
 'Fill in Blank: Classroom', @part_classroom);

-- Vòng 8: RE_ORDER_SENTENCE
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Re-order sentence classroom', 'RE_ORDER_SENTENCE', 8,
 JSON_OBJECT(
  'title', 'Re-order Sentence: Classroom',
  'items', JSON_ARRAY(
    JSON_OBJECT(
      'order', 1,
      'sentence', 'The bag is on the desk.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/reorder_01.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=The+bag+is+on+the+desk.&type=2'
    ),
    JSON_OBJECT(
      'order', 2,
      'sentence', 'Where is the pencil case?',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/reorder_02.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where+is+the+pencil+case%3F&type=2'
    ),
    JSON_OBJECT(
      'order', 3,
      'sentence', 'The red crayon isn''t under the chair.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/reorder_03.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=The+red+crayon+isn%27t+under+the+chair.&type=2'
    ),
    JSON_OBJECT(
      'order', 4,
      'sentence', 'Where are the green books?',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/reorder_04.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where+are+the+green+books%3F&type=2'
    ),
    JSON_OBJECT(
      'order', 5,
      'sentence', 'The pens aren''t in the pencil case.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/reorder_05.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=The+pens+aren%27t+in+the+pencil+case.&type=2'
    ),
    JSON_OBJECT(
      'order', 6,
      'sentence', 'The pencil is next to the book.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/reorder_06.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=The+pencil+is+next+to+the+book.&type=2'
    ),
    JSON_OBJECT(
      'order', 7,
      'sentence', 'The rubber is next to the pen.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/reorder_07.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=The+rubber+is+next+to+the+pen.&type=2'
    )
  )
),
 'Re-order Sentence: Classroom', @part_classroom);

-- Vòng 9: SPEAKING_SENTENCE (data giống vòng 8)
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Speaking sentence classroom', 'SPEAKING_SENTENCE', 9,
 JSON_OBJECT(
  'title', 'Speaking Sentence: Classroom',
  'items', JSON_ARRAY(
    JSON_OBJECT(
      'order', 1,
      'sentence', 'Where is the bag?',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/speaking_01.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where+is+the+bag%3F&type=2'
    ),
    JSON_OBJECT(
      'order', 2,
      'sentence', 'They are under the chair.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/speaking_02.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=They+are+under+the+chair.&type=2'
    ),
    JSON_OBJECT(
      'order', 3,
      'sentence', 'Is the pen on the chair?',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/speaking_03.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Is+the+pen+on+the+chair%3F&type=2'
    ),
    JSON_OBJECT(
      'order', 4,
      'sentence', 'Yes, it''s next to the red book.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/speaking_04.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Yes%2C+it%27s+next+to+the+red+book.&type=2'
    ),
    JSON_OBJECT(
      'order', 5,
      'sentence', 'No, it''s not in the pencil case.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/speaking_05.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=No%2C+it%27s+not+in+the+pencil+case.&type=2'
    ),
    JSON_OBJECT(
      'order', 6,
      'sentence', 'Is it next to the book?',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/speaking_06.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Is+it+next+to+the+book%3F&type=2'
    ),
    JSON_OBJECT(
      'order', 7,
      'sentence', 'It''s next to the pencil case.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/speaking_07.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=It%27s+next+to+the+pencil+case.&type=2'
    ),
    JSON_OBJECT(
      'order', 8,
      'sentence', 'Yes, it''s on the chair.',
      'image_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Classroom/speaking_08.webp',
      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Yes%2C+it%27s+on+the+chair.&type=2'
    )
  )
),
 'Speaking Sentence: Classroom', @part_classroom);

-- Vòng 10: CONVERSATION
INSERT INTO `sessions`
(`create_at`, `create_by`, `is_delete`, `update_at`, `update_by`,
 `badge_id`, `description`, `session_type`, `order_index`, `payload`, `title`, `part_id`)
VALUES
(NOW(), 1, 0, NOW(), 1, NULL,
 'Conversation classroom', 'CONVERSATION', 10,
 JSON_OBJECT(
  'title', 'Conversation: Classroom',
  'items', JSON_ARRAY(
    JSON_OBJECT(
      'order', 1,
      'question',   JSON_OBJECT('type', 'question',   'text', 'Where''s the teacher?',               'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where%27s+the+teacher%3F&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'I don''t know. She isn''t in the classroom', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=I+don%27t+know.+She+isn%27t+in+the+classroom&type=2', 'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'This is your teacher.',               'audio_url', 'https://dict.youdao.com/dictvoice?audio=This+is+your+teacher.&type=2',                          'is_correct', FALSE)
    ),
    JSON_OBJECT(
      'order', 2,
      'question',   JSON_OBJECT('type', 'question',   'text', 'Is the crayon in the pencil case?',   'audio_url', 'https://dict.youdao.com/dictvoice?audio=Is+the+crayon+in+the+pencil+case%3F&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'No, it isn''t. It''s on the desk.',    'audio_url', 'https://dict.youdao.com/dictvoice?audio=No%2C+it+isn%27t.+It%27s+on+the+desk.&type=2',         'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'It''s a pencil case.',                'audio_url', 'https://dict.youdao.com/dictvoice?audio=It%27s+a+pencil+case.&type=2',                          'is_correct', FALSE)
    ),
    JSON_OBJECT(
      'order', 3,
      'question',   JSON_OBJECT('type', 'question',   'text', 'Where''s the rubber?',                'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where%27s+the+rubber%3F&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'It''s under the book.',               'audio_url', 'https://dict.youdao.com/dictvoice?audio=It%27s+under+the+book.&type=2',                         'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'This is my book.',                    'audio_url', 'https://dict.youdao.com/dictvoice?audio=This+is+my+book.&type=2',                               'is_correct', FALSE)
    ),
    JSON_OBJECT(
      'order', 4,
      'question',   JSON_OBJECT('type', 'question',   'text', 'Is the book on the chair?',           'audio_url', 'https://dict.youdao.com/dictvoice?audio=Is+the+book+on+the+chair%3F&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'No, it isn''t. It''s next to the bag.', 'audio_url', 'https://dict.youdao.com/dictvoice?audio=No%2C+it+isn%27t.+It%27s+next+to+the+bag.&type=2', 'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'Yes, it''s a chair.',                 'audio_url', 'https://dict.youdao.com/dictvoice?audio=Yes%2C+it%27s+a+chair.&type=2',                          'is_correct', FALSE)
    ),
    JSON_OBJECT(
      'order', 5,
      'question',   JSON_OBJECT('type', 'question',   'text', 'Where''s your pencil case?',          'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where%27s+your+pencil+case%3F&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'It''s in my bag.',                    'audio_url', 'https://dict.youdao.com/dictvoice?audio=It%27s+in+my+bag.&type=2',                               'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'Is it in my pencil case?',            'audio_url', 'https://dict.youdao.com/dictvoice?audio=Is+it+in+my+pencil+case%3F&type=2',                     'is_correct', FALSE)
    ),
    JSON_OBJECT(
      'order', 6,
      'question',   JSON_OBJECT('type', 'question',   'text', 'Is the desk next to the chair?',      'audio_url', 'https://dict.youdao.com/dictvoice?audio=Is+the+desk+next+to+the+chair%3F&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'Yes, it is.',                         'audio_url', 'https://dict.youdao.com/dictvoice?audio=Yes%2C+it+is.&type=2',                                  'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'Yes, it''s a desk.',                  'audio_url', 'https://dict.youdao.com/dictvoice?audio=Yes%2C+it%27s+a+desk.&type=2',                           'is_correct', FALSE)
    ),
    JSON_OBJECT(
      'order', 7,
      'question',   JSON_OBJECT('type', 'question',   'text', 'Where''s your blue pen?',             'audio_url', 'https://dict.youdao.com/dictvoice?audio=Where%27s+your+blue+pen%3F&type=2'),
      'answer',     JSON_OBJECT('type', 'answer',     'text', 'It''s on the chair.',                 'audio_url', 'https://dict.youdao.com/dictvoice?audio=It%27s+on+the+chair.&type=2',                           'is_correct', TRUE),
      'distractor', JSON_OBJECT('type', 'distractor', 'text', 'This is my pen.',                     'audio_url', 'https://dict.youdao.com/dictvoice?audio=This+is+my+pen.&type=2',                                'is_correct', FALSE)
    )
  )
),
 'Conversation: Classroom', @part_classroom);

-- ============================================================
-- 6. KHÔNG reset AUTO_INCREMENT
-- ============================================================