USE `enjoy_learning_db`;

-- =========================================================================
-- 1. LEVELS
-- =========================================================================
INSERT INTO levels (id, name, code, order_index, create_at, update_at, create_by, update_by, is_delete) VALUES
(1, 'Pre A1 - Beginner', 'PRE_A1', 1, NOW(), NOW(), NULL, NULL, false);

-- =========================================================================
-- 2. TOPICS
-- =========================================================================
INSERT INTO topics (id, level_id, title, description, thumbnail_url, order_index, create_at, update_at, create_by, update_by, is_delete) VALUES
(1, 1, 'Animal', 'Chủ đề về các loài động vật', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80', 1, NOW(), NOW(), NULL, NULL, false);

-- =========================================================================
-- 3. PARTS
-- =========================================================================
INSERT INTO parts (id, topic_id, title, order_index, create_at, update_at, create_by, update_by, is_delete) VALUES
(1, 1, 'At the Zoo',  1, NOW(), NOW(), NULL, NULL, false),
(2, 1, 'My Pets',     2, NOW(), NOW(), NULL, NULL, false),
(3, 1, 'On the Farm', 3, NOW(), NOW(), NULL, NULL, false),
(4, 1, 'Animal Game', 4, NOW(), NOW(), NULL, NULL, false);

-- =========================================================================
-- 4. SESSIONS (5 session / part)
-- =========================================================================
INSERT INTO sessions (id, part_id, session_type, badge_id, title, description, order_index, create_at, update_at, create_by, update_by, is_delete) VALUES
-- Part 1: At the Zoo
(1,  1, 'INTRODUCTION',      NULL, 'Introduction',      'Nghe hội thoại và làm quen từ vựng', 1, NOW(), NOW(), NULL, NULL, false),
(2,  1, 'LISTENING',         NULL, 'Listening',         'Luyện nghe các câu target',          2, NOW(), NOW(), NULL, NULL, false),
(3,  1, 'SPEAKING',          NULL, 'Speaking',          'Luyện nói các câu target',           3, NOW(), NOW(), NULL, NULL, false),
(4,  1, 'WORD_RECOGNITION',  NULL, 'Word Recognition',  'Nhận diện từ khóa',                  4, NOW(), NOW(), NULL, NULL, false),
(5,  1, 'GAMIFIED_REVIEW',   NULL, 'Gamified Review',   'Ôn tập qua trò chơi',                5, NOW(), NOW(), NULL, NULL, false),
-- Part 2: My Pets
(6,  2, 'INTRODUCTION',      NULL, 'Introduction',      'Nghe hội thoại và làm quen từ vựng', 1, NOW(), NOW(), NULL, NULL, false),
(7,  2, 'LISTENING',         NULL, 'Listening',         'Luyện nghe các câu target',          2, NOW(), NOW(), NULL, NULL, false),
(8,  2, 'SPEAKING',          NULL, 'Speaking',          'Luyện nói các câu target',           3, NOW(), NOW(), NULL, NULL, false),
(9,  2, 'WORD_RECOGNITION',  NULL, 'Word Recognition',  'Nhận diện từ khóa',                  4, NOW(), NOW(), NULL, NULL, false),
(10, 2, 'GAMIFIED_REVIEW',   NULL, 'Gamified Review',   'Ôn tập qua trò chơi',                5, NOW(), NOW(), NULL, NULL, false),
-- Part 3: On the Farm
(11, 3, 'INTRODUCTION',      NULL, 'Introduction',      'Nghe hội thoại và làm quen từ vựng', 1, NOW(), NOW(), NULL, NULL, false),
(12, 3, 'LISTENING',         NULL, 'Listening',         'Luyện nghe các câu target',          2, NOW(), NOW(), NULL, NULL, false),
(13, 3, 'SPEAKING',          NULL, 'Speaking',          'Luyện nói các câu target',           3, NOW(), NOW(), NULL, NULL, false),
(14, 3, 'WORD_RECOGNITION',  NULL, 'Word Recognition',  'Nhận diện từ khóa',                  4, NOW(), NOW(), NULL, NULL, false),
(15, 3, 'GAMIFIED_REVIEW',   NULL, 'Gamified Review',   'Ôn tập qua trò chơi',                5, NOW(), NOW(), NULL, NULL, false),
-- Part 4: Animal Game
(16, 4, 'INTRODUCTION',      NULL, 'Introduction',      'Nghe hội thoại và làm quen từ vựng', 1, NOW(), NOW(), NULL, NULL, false),
(17, 4, 'LISTENING',         NULL, 'Listening',         'Luyện nghe các câu target',          2, NOW(), NOW(), NULL, NULL, false),
(18, 4, 'SPEAKING',          NULL, 'Speaking',          'Luyện nói các câu target',           3, NOW(), NOW(), NULL, NULL, false),
(19, 4, 'WORD_RECOGNITION',  NULL, 'Word Recognition',  'Nhận diện từ khóa',                  4, NOW(), NOW(), NULL, NULL, false),
(20, 4, 'GAMIFIED_REVIEW',   NULL, 'Gamified Review',   'Ôn tập qua trò chơi',                5, NOW(), NOW(), NULL, NULL, FALSE);
-- =========================================================================
-- 5. SESSION_ITEMS  (TARGET = image+audio+keyword | SUPPORT = audio only)
-- Thứ tự ID theo đúng thứ tự xuất hiện trong từng conversation
-- =========================================================================
INSERT INTO session_items
(id, content_text, translation, image_url, audio_url, item_type, speaker_role, keyword, keyword_translation, keyword_audio_url,
 create_at, update_at, create_by, update_by, is_delete) VALUES

-- ---------- Conversation 1: At the Zoo ----------
(1,  'Welcome to the zoo!',           'Chào mừng đến sở thú!',        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/zoo.webp', 'https://dict.youdao.com/dictvoice?audio=Welcome+to+the+zoo%21&type=2',            'TARGET',  'SPEAKER_1', 'zoo',        'sở thú',          'https://dict.youdao.com/dictvoice?audio=zoo&type=2',        NOW(), NOW(), NULL, NULL, false),
(2,  'Wow! There are many animals.',  'Wow! Có rất nhiều động vật.',  NULL, 'https://dict.youdao.com/dictvoice?audio=Wow%21+There+are+many+animals.&type=2',                        'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),
(3,  'The elephant is very big.',     'Con voi rất to.',              'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/elephant.webp', 'https://dict.youdao.com/dictvoice?audio=The+elephant+is+very+big.&type=2',         'TARGET',  'SPEAKER_1', 'elephant',   'con voi',         'https://dict.youdao.com/dictvoice?audio=elephant&type=2',   NOW(), NOW(), NULL, NULL, false),
(4,  'Can it swim?',                  'Nó có biết bơi không?',        NULL, 'https://dict.youdao.com/dictvoice?audio=Can+it+swim%3F&type=2',                                        'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),
(5,  'The hippo is in the water.',    'Con hà mã ở trong nước.',      'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/hippo.webp', 'https://dict.youdao.com/dictvoice?audio=The+hippo+is+in+the+water.&type=2',        'TARGET',  'SPEAKER_1', 'hippo',      'con hà mã',       'https://dict.youdao.com/dictvoice?audio=hippo&type=2',      NOW(), NOW(), NULL, NULL, false),
(6,  'Look over there!',              'Nhìn kìa!',                    NULL, 'https://dict.youdao.com/dictvoice?audio=Look+over+there%21&type=2',                                    'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),
(7,  'The monkey is funny.',          'Con khỉ thật buồn cười.',      'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/monkey.webp', 'https://dict.youdao.com/dictvoice?audio=The+monkey+is+funny.&type=2',              'TARGET',  'SPEAKER_1', 'monkey',     'con khỉ',         'https://dict.youdao.com/dictvoice?audio=monkey&type=2',     NOW(), NOW(), NULL, NULL, false),
(8,  'The giraffe is very tall.',     'Con hươu cao cổ rất cao.',     'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/giraffe.webp', 'https://dict.youdao.com/dictvoice?audio=The+giraffe+is+very+tall.&type=2',         'TARGET',  'SPEAKER_2', 'giraffe',    'con hươu cao cổ', 'https://dict.youdao.com/dictvoice?audio=giraffe&type=2',  NOW(), NOW(), NULL, NULL, false),
(9,  'The crocodile is very long.',   'Con cá sấu rất dài.',          'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/crocodile.webp', 'https://dict.youdao.com/dictvoice?audio=The+crocodile+is+very+long.&type=2',       'TARGET',  'SPEAKER_1', 'crocodile',  'con cá sấu',      'https://dict.youdao.com/dictvoice?audio=crocodile&type=2',NOW(), NOW(), NULL, NULL, false),
(10, 'I like the zoo!',               'Tôi thích sở thú!',            NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+the+zoo%21&type=2',                                     'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),

-- ---------- Conversation 2: My Pets ----------
(11, 'Have you got a pet?',           'Bạn có thú cưng không?',       'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/pet.webp', 'https://dict.youdao.com/dictvoice?audio=Have+you+got+a+pet%3F&type=2',             'TARGET',  'SPEAKER_1', 'pet',        'thú cưng',        'https://dict.youdao.com/dictvoice?audio=pet&type=2',        NOW(), NOW(), NULL, NULL, false),
(12, 'Yes, I have.',                  'Vâng, tôi có.',                NULL, 'https://dict.youdao.com/dictvoice?audio=Yes%2C+I+have.&type=2',                                        'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),
(13, 'The dog can run fast.',         'Con chó có thể chạy nhanh.',   'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/dog.webp', 'https://dict.youdao.com/dictvoice?audio=The+dog+can+run+fast.&type=2',             'TARGET',  'SPEAKER_1', 'dog',        'con chó',         'https://dict.youdao.com/dictvoice?audio=dog&type=2',        NOW(), NOW(), NULL, NULL, false),
(14, 'The cat is sleeping.',          'Con mèo đang ngủ.',            'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/cat.webp', 'https://dict.youdao.com/dictvoice?audio=The+cat+is+sleeping.&type=2',              'TARGET',  'SPEAKER_2', 'cat',        'con mèo',         'https://dict.youdao.com/dictvoice?audio=cat&type=2',        NOW(), NOW(), NULL, NULL, false),
(15, 'I like your pets.',             'Tôi thích thú cưng của bạn.',  NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+your+pets.&type=2',                                     'SUPPORT', 'SPEAKER_1', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),
(16, 'The fish can swim.',            'Con cá có thể bơi.',           'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/fish.webp', 'https://dict.youdao.com/dictvoice?audio=The+fish+can+swim.&type=2',                'TARGET',  'SPEAKER_2', 'fish',       'con cá',          'https://dict.youdao.com/dictvoice?audio=fish&type=2',       NOW(), NOW(), NULL, NULL, false),
(17, 'The bird is singing.',          'Con chim đang hót.',           'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bird.webp', 'https://dict.youdao.com/dictvoice?audio=The+bird+is+singing.&type=2',              'TARGET',  'SPEAKER_1', 'bird',       'con chim',        'https://dict.youdao.com/dictvoice?audio=bird&type=2',       NOW(), NOW(), NULL, NULL, false),
(18, 'The mouse is very small.',      'Con chuột rất nhỏ.',           'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/mouse.webp', 'https://dict.youdao.com/dictvoice?audio=The+mouse+is+very+small.&type=2',          'TARGET',  'SPEAKER_2', 'mouse',      'con chuột',       'https://dict.youdao.com/dictvoice?audio=mouse&type=2',      NOW(), NOW(), NULL, NULL, false),

-- ---------- Conversation 3: On the Farm ----------
(19, 'The cow is eating.',            'Con bò đang ăn.',              'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/cow.webp', 'https://dict.youdao.com/dictvoice?audio=The+cow+is+eating.&type=2',                'TARGET',  'SPEAKER_1', 'cow',        'con bò',          'https://dict.youdao.com/dictvoice?audio=cow&type=2',        NOW(), NOW(), NULL, NULL, false),
(20, 'It''s hungry.',                 'Nó đang đói.',                 NULL, 'https://dict.youdao.com/dictvoice?audio=It%27s+hungry.&type=2',                                        'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),
(21, 'The horse is under the tree.',  'Con ngựa ở dưới gốc cây.',     'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/horse.webp', 'https://dict.youdao.com/dictvoice?audio=The+horse+is+under+the+tree.&type=2',      'TARGET',  'SPEAKER_1', 'horse',      'con ngựa',        'https://dict.youdao.com/dictvoice?audio=horse&type=2',      NOW(), NOW(), NULL, NULL, false),
(22, 'I can see it.',                 'Tôi có thể nhìn thấy nó.',     NULL, 'https://dict.youdao.com/dictvoice?audio=I+can+see+it.&type=2',                                         'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),
(23, 'The sheep is white.',           'Con cừu màu trắng.',           'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/sheep.webp', 'https://dict.youdao.com/dictvoice?audio=The+sheep+is+white.&type=2',               'TARGET',  'SPEAKER_1', 'sheep',      'con cừu',         'https://dict.youdao.com/dictvoice?audio=sheep&type=2',      NOW(), NOW(), NULL, NULL, false),
(24, 'Look!',                         'Nhìn kìa!',                    NULL, 'https://dict.youdao.com/dictvoice?audio=Look%21&type=2',                                               'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),
(25, 'The goat is jumping.',          'Con dê đang nhảy.',            'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/goat.webp', 'https://dict.youdao.com/dictvoice?audio=The+goat+is+jumping.&type=2',              'TARGET',  'SPEAKER_1', 'goat',       'con dê',          'https://dict.youdao.com/dictvoice?audio=goat&type=2',       NOW(), NOW(), NULL, NULL, false),
(26, 'The duck is in the water.',     'Con vịt ở trong nước.',        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/duck.webp', 'https://dict.youdao.com/dictvoice?audio=The+duck+is+in+the+water.&type=2',         'TARGET',  'SPEAKER_1', 'duck',       'con vịt',         'https://dict.youdao.com/dictvoice?audio=duck&type=2',       NOW(), NOW(), NULL, NULL, false),
(27, 'The chicken is small.',         'Con gà nhỏ.',                  'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/chicken.webp', 'https://dict.youdao.com/dictvoice?audio=The+chicken+is+small.&type=2',             'TARGET',  'SPEAKER_2', 'chicken',    'con gà',          'https://dict.youdao.com/dictvoice?audio=chicken&type=2',    NOW(), NOW(), NULL, NULL, false),
(28, 'What a nice farm!',             'Thật là một nông trại đẹp!',   NULL, 'https://dict.youdao.com/dictvoice?audio=What+a+nice+farm%21&type=2',                                   'SUPPORT', 'SPEAKER_1', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),

-- ---------- Conversation 4: Animal Game ----------
(29, 'Let''s play an animal game!',   'Hãy chơi trò chơi động vật!',  'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/animal.webp', 'https://dict.youdao.com/dictvoice?audio=Let%27s+play+an+animal+game%21&type=2',    'TARGET',  'SPEAKER_1', 'animal',     'động vật',        'https://dict.youdao.com/dictvoice?audio=animal&type=2',     NOW(), NOW(), NULL, NULL, false),
(30, 'Great!',                        'Tuyệt vời!',                   NULL, 'https://dict.youdao.com/dictvoice?audio=Great%21&type=2',                                              'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),
(31, 'The tiger is very strong.',     'Con hổ rất khỏe.',             'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/tiger.webp', 'https://dict.youdao.com/dictvoice?audio=The+tiger+is+very+strong.&type=2',         'TARGET',  'SPEAKER_1', 'tiger',      'con hổ',          'https://dict.youdao.com/dictvoice?audio=tiger&type=2',      NOW(), NOW(), NULL, NULL, false),
(32, 'Is it a bear?',                 'Đó có phải là con gấu không?', NULL, 'https://dict.youdao.com/dictvoice?audio=Is+it+a+bear%3F&type=2',                                       'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),
(33, 'The bear is very big.',         'Con gấu rất to.',              'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/bear.webp', 'https://dict.youdao.com/dictvoice?audio=The+bear+is+very+big.&type=2',             'TARGET',  'SPEAKER_1', 'bear',       'con gấu',         'https://dict.youdao.com/dictvoice?audio=bear&type=2',       NOW(), NOW(), NULL, NULL, false),
(34, 'Wow!',                          'Wow!',                         NULL, 'https://dict.youdao.com/dictvoice?audio=Wow%21&type=2',                                                'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false),
(35, 'The zebra is black and white.', 'Con ngựa vằn có màu đen và trắng.', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/zebra.webp', 'https://dict.youdao.com/dictvoice?audio=The+zebra+is+black+and+white.&type=2',   'TARGET',  'SPEAKER_1', 'zebra',      'con ngựa vằn',    'https://dict.youdao.com/dictvoice?audio=zebra&type=2',      NOW(), NOW(), NULL, NULL, false),
(36, 'The snake is very long.',       'Con rắn rất dài.',             'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/snake.webp', 'https://dict.youdao.com/dictvoice?audio=The+snake+is+very+long.&type=2',           'TARGET',  'SPEAKER_1', 'snake',      'con rắn',         'https://dict.youdao.com/dictvoice?audio=snake&type=2',      NOW(), NOW(), NULL, NULL, false),
(37, 'The spider is very small.',     'Con nhện rất nhỏ.',            'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/spider.webp', 'https://dict.youdao.com/dictvoice?audio=The+spider+is+very+small.&type=2',         'TARGET',  'SPEAKER_2', 'spider',     'con nhện',        'https://dict.youdao.com/dictvoice?audio=spider&type=2',     NOW(), NOW(), NULL, NULL, false),
(38, 'I like this game!',             'Tôi thích trò chơi này!',      NULL, 'https://dict.youdao.com/dictvoice?audio=I+like+this+game%21&type=2',                                   'SUPPORT', 'SPEAKER_2', NULL,         NULL,              NULL,                                                         NOW(), NOW(), NULL, NULL, false);
-- =========================================================================
-- 6. SESSION_ITEM_MAPPINGS
-- INTRODUCTION  -> map TARGET + SUPPORT theo đúng thứ tự hội thoại
-- 4 session còn lại -> map lại TARGET theo thứ tự
-- =========================================================================
INSERT INTO session_item_mappings (session_id, session_item_id, order_index, create_at, update_at, create_by, update_by, is_delete) VALUES

-- ===== Part 1: At the Zoo (session 1..5, item 1..10) =====
-- INTRODUCTION (session 1)
(1, 1, 1, NOW(), NOW(), NULL, NULL, false),
(1, 2, 2, NOW(), NOW(), NULL, NULL, false),
(1, 3, 3, NOW(), NOW(), NULL, NULL, false),
(1, 4, 4, NOW(), NOW(), NULL, NULL, false),
(1, 5, 5, NOW(), NOW(), NULL, NULL, false),
(1, 6, 6, NOW(), NOW(), NULL, NULL, false),
(1, 7, 7, NOW(), NOW(), NULL, NULL, false),
(1, 8, 8, NOW(), NOW(), NULL, NULL, false),
(1, 9, 9, NOW(), NOW(), NULL, NULL, false),
(1, 10, 10, NOW(), NOW(), NULL, NULL, false),
-- LISTENING (session 2)
(2, 1, 1, NOW(), NOW(), NULL, NULL, false),
(2, 3, 2, NOW(), NOW(), NULL, NULL, false),
(2, 5, 3, NOW(), NOW(), NULL, NULL, false),
(2, 7, 4, NOW(), NOW(), NULL, NULL, false),
(2, 8, 5, NOW(), NOW(), NULL, NULL, false),
(2, 9, 6, NOW(), NOW(), NULL, NULL, false),
-- SPEAKING (session 3)
(3, 1, 1, NOW(), NOW(), NULL, NULL, false),
(3, 3, 2, NOW(), NOW(), NULL, NULL, false),
(3, 5, 3, NOW(), NOW(), NULL, NULL, false),
(3, 7, 4, NOW(), NOW(), NULL, NULL, false),
(3, 8, 5, NOW(), NOW(), NULL, NULL, false),
(3, 9, 6, NOW(), NOW(), NULL, NULL, false),
-- WORD_RECOGNITION (session 4)
(4, 1, 1, NOW(), NOW(), NULL, NULL, false),
(4, 3, 2, NOW(), NOW(), NULL, NULL, false),
(4, 5, 3, NOW(), NOW(), NULL, NULL, false),
(4, 7, 4, NOW(), NOW(), NULL, NULL, false),
(4, 8, 5, NOW(), NOW(), NULL, NULL, false),
(4, 9, 6, NOW(), NOW(), NULL, NULL, false),
-- GAMIFIED_REVIEW (session 5)
(5, 1, 1, NOW(), NOW(), NULL, NULL, false),
(5, 3, 2, NOW(), NOW(), NULL, NULL, false),
(5, 5, 3, NOW(), NOW(), NULL, NULL, false),
(5, 7, 4, NOW(), NOW(), NULL, NULL, false),
(5, 8, 5, NOW(), NOW(), NULL, NULL, false),
(5, 9, 6, NOW(), NOW(), NULL, NULL, false),

-- ===== Part 2: My Pets (session 6..10, item 11..18) =====
-- INTRODUCTION (session 6)
(6, 11, 1, NOW(), NOW(), NULL, NULL, false),
(6, 12, 2, NOW(), NOW(), NULL, NULL, false),
(6, 13, 3, NOW(), NOW(), NULL, NULL, false),
(6, 14, 4, NOW(), NOW(), NULL, NULL, false),
(6, 15, 5, NOW(), NOW(), NULL, NULL, false),
(6, 16, 6, NOW(), NOW(), NULL, NULL, false),
(6, 17, 7, NOW(), NOW(), NULL, NULL, false),
(6, 18, 8, NOW(), NOW(), NULL, NULL, false),
-- LISTENING (session 7)
(7, 11, 1, NOW(), NOW(), NULL, NULL, false),
(7, 13, 2, NOW(), NOW(), NULL, NULL, false),
(7, 14, 3, NOW(), NOW(), NULL, NULL, false),
(7, 16, 4, NOW(), NOW(), NULL, NULL, false),
(7, 17, 5, NOW(), NOW(), NULL, NULL, false),
(7, 18, 6, NOW(), NOW(), NULL, NULL, false),
-- SPEAKING (session 8)
(8, 11, 1, NOW(), NOW(), NULL, NULL, false),
(8, 13, 2, NOW(), NOW(), NULL, NULL, false),
(8, 14, 3, NOW(), NOW(), NULL, NULL, false),
(8, 16, 4, NOW(), NOW(), NULL, NULL, false),
(8, 17, 5, NOW(), NOW(), NULL, NULL, false),
(8, 18, 6, NOW(), NOW(), NULL, NULL, false),
-- WORD_RECOGNITION (session 9)
(9, 11, 1, NOW(), NOW(), NULL, NULL, false),
(9, 13, 2, NOW(), NOW(), NULL, NULL, false),
(9, 14, 3, NOW(), NOW(), NULL, NULL, false),
(9, 16, 4, NOW(), NOW(), NULL, NULL, false),
(9, 17, 5, NOW(), NOW(), NULL, NULL, false),
(9, 18, 6, NOW(), NOW(), NULL, NULL, false),
-- GAMIFIED_REVIEW (session 10)
(10, 11, 1, NOW(), NOW(), NULL, NULL, false),
(10, 13, 2, NOW(), NOW(), NULL, NULL, false),
(10, 14, 3, NOW(), NOW(), NULL, NULL, false),
(10, 16, 4, NOW(), NOW(), NULL, NULL, false),
(10, 17, 5, NOW(), NOW(), NULL, NULL, false),
(10, 18, 6, NOW(), NOW(), NULL, NULL, false),

-- ===== Part 3: On the Farm (session 11..15, item 19..28) =====
-- INTRODUCTION (session 11)
(11, 19, 1, NOW(), NOW(), NULL, NULL, false),
(11, 20, 2, NOW(), NOW(), NULL, NULL, false),
(11, 21, 3, NOW(), NOW(), NULL, NULL, false),
(11, 22, 4, NOW(), NOW(), NULL, NULL, false),
(11, 23, 5, NOW(), NOW(), NULL, NULL, false),
(11, 24, 6, NOW(), NOW(), NULL, NULL, false),
(11, 25, 7, NOW(), NOW(), NULL, NULL, false),
(11, 26, 8, NOW(), NOW(), NULL, NULL, false),
(11, 27, 9, NOW(), NOW(), NULL, NULL, false),
(11, 28, 10, NOW(), NOW(), NULL, NULL, false),
-- LISTENING (session 12)
(12, 19, 1, NOW(), NOW(), NULL, NULL, false),
(12, 21, 2, NOW(), NOW(), NULL, NULL, false),
(12, 23, 3, NOW(), NOW(), NULL, NULL, false),
(12, 25, 4, NOW(), NOW(), NULL, NULL, false),
(12, 26, 5, NOW(), NOW(), NULL, NULL, false),
(12, 27, 6, NOW(), NOW(), NULL, NULL, false),
-- SPEAKING (session 13)
(13, 19, 1, NOW(), NOW(), NULL, NULL, false),
(13, 21, 2, NOW(), NOW(), NULL, NULL, false),
(13, 23, 3, NOW(), NOW(), NULL, NULL, false),
(13, 25, 4, NOW(), NOW(), NULL, NULL, false),
(13, 26, 5, NOW(), NOW(), NULL, NULL, false),
(13, 27, 6, NOW(), NOW(), NULL, NULL, false),
-- WORD_RECOGNITION (session 14)
(14, 19, 1, NOW(), NOW(), NULL, NULL, false),
(14, 21, 2, NOW(), NOW(), NULL, NULL, false),
(14, 23, 3, NOW(), NOW(), NULL, NULL, false),
(14, 25, 4, NOW(), NOW(), NULL, NULL, false),
(14, 26, 5, NOW(), NOW(), NULL, NULL, false),
(14, 27, 6, NOW(), NOW(), NULL, NULL, false),
-- GAMIFIED_REVIEW (session 15)
(15, 19, 1, NOW(), NOW(), NULL, NULL, false),
(15, 21, 2, NOW(), NOW(), NULL, NULL, false),
(15, 23, 3, NOW(), NOW(), NULL, NULL, false),
(15, 25, 4, NOW(), NOW(), NULL, NULL, false),
(15, 26, 5, NOW(), NOW(), NULL, NULL, false),
(15, 27, 6, NOW(), NOW(), NULL, NULL, false),

-- ===== Part 4: Animal Game (session 16..20, item 29..38) =====
-- INTRODUCTION (session 16)
(16, 29, 1, NOW(), NOW(), NULL, NULL, false),
(16, 30, 2, NOW(), NOW(), NULL, NULL, false),
(16, 31, 3, NOW(), NOW(), NULL, NULL, false),
(16, 32, 4, NOW(), NOW(), NULL, NULL, false),
(16, 33, 5, NOW(), NOW(), NULL, NULL, false),
(16, 34, 6, NOW(), NOW(), NULL, NULL, false),
(16, 35, 7, NOW(), NOW(), NULL, NULL, false),
(16, 36, 8, NOW(), NOW(), NULL, NULL, false),
(16, 37, 9, NOW(), NOW(), NULL, NULL, false),
(16, 38, 10, NOW(), NOW(), NULL, NULL, false),
-- LISTENING (session 17)
(17, 29, 1, NOW(), NOW(), NULL, NULL, false),
(17, 31, 2, NOW(), NOW(), NULL, NULL, false),
(17, 33, 3, NOW(), NOW(), NULL, NULL, false),
(17, 35, 4, NOW(), NOW(), NULL, NULL, false),
(17, 36, 5, NOW(), NOW(), NULL, NULL, false),
(17, 37, 6, NOW(), NOW(), NULL, NULL, false),
-- SPEAKING (session 18)
(18, 29, 1, NOW(), NOW(), NULL, NULL, false),
(18, 31, 2, NOW(), NOW(), NULL, NULL, false),
(18, 33, 3, NOW(), NOW(), NULL, NULL, false),
(18, 35, 4, NOW(), NOW(), NULL, NULL, false),
(18, 36, 5, NOW(), NOW(), NULL, NULL, false),
(18, 37, 6, NOW(), NOW(), NULL, NULL, false),
-- WORD_RECOGNITION (session 19)
(19, 29, 1, NOW(), NOW(), NULL, NULL, false),
(19, 31, 2, NOW(), NOW(), NULL, NULL, false),
(19, 33, 3, NOW(), NOW(), NULL, NULL, false),
(19, 35, 4, NOW(), NOW(), NULL, NULL, false),
(19, 36, 5, NOW(), NOW(), NULL, NULL, false),
(19, 37, 6, NOW(), NOW(), NULL, NULL, false),
-- GAMIFIED_REVIEW (session 20)
(20, 29, 1, NOW(), NOW(), NULL, NULL, false),
(20, 31, 2, NOW(), NOW(), NULL, NULL, false),
(20, 33, 3, NOW(), NOW(), NULL, NULL, false),
(20, 35, 4, NOW(), NOW(), NULL, NULL, false),
(20, 36, 5, NOW(), NOW(), NULL, NULL, false),
(20, 37, 6, NOW(), NOW(), NULL, NULL, false);
