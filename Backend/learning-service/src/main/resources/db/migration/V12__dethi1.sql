USE enjoy_learning_db;

INSERT INTO exams (exam_type, title, description, level, listening_duration, reading_duration, total_listening_questions, total_reading_questions, listening_payload, reading_payload)
VALUES (
  'COLLINS',
  'Collins 2018 - Test 1',
  'Test 1 trong bộ đề thi do Collins 2018 xuất bản',
  'Pre-A1',
  20,
  20,
  20,
  25,
  JSON_OBJECT(
    'part1', JSON_OBJECT(
      'audio_url', '',
      'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part1.jpg',
      'coordinates', JSON_ARRAY(
        JSON_OBJECT('word', 'Alice', 'x', 0.3369, 'y', 0.2907, 'width', 0.1313, 'height', 0.0442, 'is_example', TRUE),
        JSON_OBJECT('word', 'Matt', 'x', 0.1882, 'y', 0.1985, 'width', 0.1313, 'height', 0.0442, 'is_example', FALSE),
        JSON_OBJECT('word', 'Eva', 'x', 0.077, 'y', 0.5157, 'width', 0.1313, 'height', 0.0442, 'is_example', FALSE),
        JSON_OBJECT('word', 'Nick', 'x', 0.7638, 'y', 0.6664, 'width', 0.1313, 'height', 0.0442, 'is_example', FALSE),
        JSON_OBJECT('word', 'Mark', 'x', 0.6637, 'y', 0.4237, 'width', 0.1313, 'height', 0.0442, 'is_example', FALSE),
        JSON_OBJECT('word', 'Hugo', 'x', 0.005, 'y', 0.3652, 'width', 0.1313, 'height', 0.0442, 'is_example', FALSE)
      )
    ),
    'part2', JSON_OBJECT(
      'audio_url', '',
      'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part2.png',
      'questions', JSON_ARRAY(
        JSON_OBJECT('is_example', TRUE, 'question', 'What''s the number of Lucy''s house?', 'answer_format', '[keyword]', 'keyword', '18'),
        JSON_OBJECT('is_example', TRUE, 'question', 'What''s the boy''s name?', 'answer_format', '[keyword]', 'keyword', 'Tom'),
        JSON_OBJECT('is_example', FALSE, 'question', 'How many sisters has Tom got?', 'answer_format', '[keyword]', 'keyword', '1'),
        JSON_OBJECT('is_example', FALSE, 'question', 'What''s Lucy''s sister''s name?', 'answer_format', '[keyword]', 'keyword', 'Pat'),
        JSON_OBJECT('is_example', FALSE, 'question', 'How old is Lucy''s cat?', 'answer_format', '[keyword]', 'keyword', '12'),
        JSON_OBJECT('is_example', FALSE, 'question', 'What''s Lucy''s favourite cat''s name?', 'answer_format', '[keyword]', 'keyword', 'Sam'),
        JSON_OBJECT('is_example', FALSE, 'question', 'How many cats has Lucy got?', 'answer_format', '[keyword]', 'keyword', '3')
      )
    ),
    'part3', JSON_OBJECT(
  'audio_url', '',
  'questions', JSON_ARRAY(
    JSON_OBJECT(
      'is_example', TRUE,
      'question', 'What''s Kim wearing?',
      'img_urls', JSON_ARRAY(
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_example_a.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_example_b.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_example_c.png'
      ),
      'answer', 'B'
    ),
    JSON_OBJECT(
      'is_example', FALSE,
      'question', 'Where''s Dad''s camera?',
      'img_urls', JSON_ARRAY(
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_1a.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_1b.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_1c.png'
      ),
      'answer', 'C'
    ),
    JSON_OBJECT(
      'is_example', FALSE,
      'question', 'What does Tom like?',
      'img_urls', JSON_ARRAY(
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_2a.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_2b.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_2c.png'
      ),
      'answer', 'B'
    ),
    JSON_OBJECT(
      'is_example', FALSE,
      'question', 'What''s Jill drawing?',
      'img_urls', JSON_ARRAY(
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_3a.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_3b.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_3c.png'
      ),
      'answer', 'A'
    ),
    JSON_OBJECT(
      'is_example', FALSE,
      'question', 'What sport does Bill play at school?',
      'img_urls', JSON_ARRAY(
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_4a.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_4b.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_4c.png'
      ),
      'answer', 'B'
    ),
    JSON_OBJECT(
      'is_example', FALSE,
      'question', 'Which is Sue''s bike?',
      'img_urls', JSON_ARRAY(
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_5a.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_5b.png',
        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part3_5c.png'
      ),
      'answer', 'C'
    )
  )
),
    'part4', JSON_OBJECT(
      'audio_url', '',
      'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/lis_part4.png',
      'coordinates', JSON_ARRAY(
        JSON_OBJECT('word', 'red', 'x', 0.4054, 'y', 0.6253, 'width', 0.1307, 'height', 0.0425, 'is_example', FALSE),
        JSON_OBJECT('word', 'yellow', 'x', 0.8102, 'y', 0.2665, 'width', 0.1307, 'height', 0.0425, 'is_example', FALSE),
        JSON_OBJECT('word', 'brown', 'x', 0.2947, 'y', 0.7127, 'width', 0.1307, 'height', 0.0425, 'is_example', FALSE),
        JSON_OBJECT('word', 'pink', 'x', 0.0025, 'y', 0.4804, 'width', 0.1307, 'height', 0.0425, 'is_example', FALSE),
        JSON_OBJECT('word', 'grey', 'x', 0.4327, 'y', 0.5087, 'width', 0.1307, 'height', 0.0425, 'is_example', FALSE)
      )
    )
  ),
  JSON_OBJECT(
    'part1', JSON_ARRAY(
      JSON_OBJECT('is_example', TRUE, 'question', 'This is a nose.', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part1_example_a.png', 'status', 'right'),
      JSON_OBJECT('is_example', TRUE, 'question', 'This is a dress.', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part1_example_b.png', 'status', 'wrong'),
      JSON_OBJECT('is_example', FALSE, 'question', 'This is a fish.', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part1_1.png', 'status', 'right'),
      JSON_OBJECT('is_example', FALSE, 'question', 'These are kiwis.', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part1_2.png', 'status', 'wrong'),
      JSON_OBJECT('is_example', FALSE, 'question', 'This is a piano.', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part1_3.png', 'status', 'right'),
      JSON_OBJECT('is_example', FALSE, 'question', 'This is a sofa.', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part1_4.png', 'status', 'right'),
      JSON_OBJECT('is_example', FALSE, 'question', 'These are helicopters.', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part1_5.png', 'status', 'wrong')
    ),
    'part2', JSON_OBJECT(
      'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part2.png',
      'questions', JSON_ARRAY(
        JSON_OBJECT('is_example', TRUE, 'question', 'There is a monkey in the tree.', 'status', 'no'),
        JSON_OBJECT('is_example', TRUE, 'question', 'The girl has got a bag.', 'status', 'yes'),
        JSON_OBJECT('is_example', FALSE, 'question', 'There are two green frogs.', 'status', 'yes'),
        JSON_OBJECT('is_example', FALSE, 'question', 'The girl is wearing a green skirt.', 'status', 'no'),
        JSON_OBJECT('is_example', FALSE, 'question', 'Two ducks are swimming in the water.', 'status', 'yes'),
        JSON_OBJECT('is_example', FALSE, 'question', 'The young boy is catching a ball.', 'status', 'no'),
        JSON_OBJECT('is_example', FALSE, 'question', 'There is a spider on some flowers.', 'status', 'yes')
      )
    ),
    'part3', JSON_ARRAY(
      JSON_OBJECT('is_example', TRUE, 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part3_example.png', 'word', 'boat'),
      JSON_OBJECT('is_example', FALSE, 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part3_1.png', 'word', 'kite'),
      JSON_OBJECT('is_example', FALSE, 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part3_2.png', 'word', 'train'),
      JSON_OBJECT('is_example', FALSE, 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part3_3.png', 'word', 'robot'),
      JSON_OBJECT('is_example', FALSE, 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part3_4.png', 'word', 'lorry'),
      JSON_OBJECT('is_example', FALSE, 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part3_5.png', 'word', 'helicopter')
    ),
    'part4', JSON_OBJECT(
      'text', 'Lizards have got four legs, a long (1) and two (2) Their babies come from (3) Lizards like sitting in the (4) on hot days. They can run and they can (5) but they cannot fly.',
      'options', JSON_ARRAY(
        JSON_OBJECT('word', 'legs', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part4_legs.png'),
        JSON_OBJECT('word', 'tree', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part4_tree.png'),
        JSON_OBJECT('word', 'eyes', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part4_eyes.png'),
        JSON_OBJECT('word', 'swim', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part4_swim.png'),
        JSON_OBJECT('word', 'apples', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part4_apples.png'),
        JSON_OBJECT('word', 'eggs', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part4_eggs.png'),
        JSON_OBJECT('word', 'sun', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part4_sun.png'),
        JSON_OBJECT('word', 'tail', 'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part4_tail.png')
      ),
      'answers', JSON_ARRAY(
        JSON_OBJECT('position', 1, 'word', 'tail'),
        JSON_OBJECT('position', 2, 'word', 'eyes'),
        JSON_OBJECT('position', 3, 'word', 'eggs'),
        JSON_OBJECT('position', 4, 'word', 'sun'),
        JSON_OBJECT('position', 5, 'word', 'swim')
      )
    ),
    'part5', JSON_ARRAY(
      JSON_OBJECT(
        'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part5_example.png',
        'questions', JSON_ARRAY(
          JSON_OBJECT('is_example', TRUE, 'question', 'How many monkeys are there?', 'answer_format', '[keyword]', 'keyword', 'three'),
          JSON_OBJECT('is_example', TRUE, 'question', 'Where is the elephant?', 'answer_format', 'behind the [keyword]', 'keyword', 'tree'),
          JSON_OBJECT('is_example', FALSE, 'question', 'What colour is the bird?', 'answer_format', '[keyword] and blue', 'keyword', 'red')
        )
      ),
      JSON_OBJECT(
        'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part5_1.png',
        'questions', JSON_ARRAY(
          JSON_OBJECT('is_example', FALSE, 'question', 'Which animal is in the water?', 'answer_format', 'the [keyword]', 'keyword', 'monkey'),
          JSON_OBJECT('is_example', FALSE, 'question', 'Where is the snake?', 'answer_format', 'in the [keyword]', 'keyword', 'tree')
        )
      ),
      JSON_OBJECT(
        'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test1/read_part5_2.png',
        'questions', JSON_ARRAY(
          JSON_OBJECT('is_example', FALSE, 'question', 'What has the monkey got?', 'answer_format', 'a [keyword]', 'keyword', 'coconut'),
          JSON_OBJECT('is_example', FALSE, 'question', 'Who is taking a photo?', 'answer_format', 'the [keyword]', 'keyword', 'man')
        )
      )
    )
  )
);

UPDATE exams SET is_delete = 0, create_at = NOW() WHERE id = 1;