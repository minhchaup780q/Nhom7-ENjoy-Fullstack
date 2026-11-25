USE enjoy_learning_db;

INSERT INTO exams (
    exam_type,
    title,
    description,
    level,
    listening_duration,
    reading_duration,
    total_listening_questions,
    total_reading_questions,
    listening_payload,
    reading_payload,
    is_delete,
    create_at
)
VALUES (
    'COLLINS',
    'Collins 2018 - Test 2',
    'Test 2 trong bộ đề thi do Collins 2018 xuất bản',
    'Pre-A1',
    20,
    20,
    20,
    25,
    JSON_OBJECT(
        'part1', JSON_OBJECT(
            'audio_url', '',
            'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part1.jpg',
            'coordinates', JSON_ARRAY(
                JSON_OBJECT(
                    'word', 'Kim',
                    'x', 0.6549,
                    'y', 0.4506,
                    'width', 0.0937,
                    'height', 0.0321,
                    'is_example', TRUE
                ),
                JSON_OBJECT(
                    'word', 'Anna',
                    'x', 0.7861,
                    'y', 0.5385,
                    'width', 0.0937,
                    'height', 0.0321,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'Bill',
                    'x', 0.5736,
                    'y', 0.681,
                    'width', 0.0937,
                    'height', 0.0321,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'Tom',
                    'x', 0.2399,
                    'y', 0.7607,
                    'width', 0.0937,
                    'height', 0.0321,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'Sue',
                    'x', 0.4087,
                    'y', 0.567,
                    'width', 0.0937,
                    'height', 0.0321,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'Lucy',
                    'x', 0.5528,
                    'y', 0.3709,
                    'width', 0.1307,
                    'height', 0.0376,
                    'is_example', FALSE
                )
            )
        ),
        'part2', JSON_OBJECT(
            'audio_url', '',
            'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part2.png',
            'questions', JSON_ARRAY(
                JSON_OBJECT(
                    'is_example', TRUE,
                    'question', 'What''s the girl''s name?',
                    'answer_format', '[keyword]',
                    'keyword', 'Jill'
                ),
                JSON_OBJECT(
                    'is_example', TRUE,
                    'question', 'How old is she?',
                    'answer_format', '[keyword]',
                    'keyword', '8'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'How old is Alex?',
                    'answer_format', '[keyword]',
                    'keyword', '7'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'What''s Alex''s cousin''s name?',
                    'answer_format', '[keyword]',
                    'keyword', 'Grace'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'How many friends has Alex got?',
                    'answer_format', '[keyword]',
                    'keyword', '6'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'There is a boy with black hair. What''s his name?',
                    'answer_format', '[keyword]',
                    'keyword', 'Ben'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'How many children are in Alex''s class?',
                    'answer_format', '[keyword]',
                    'keyword', '19'
                )
            )
        ),
        'part3', JSON_OBJECT(
            'audio_url', '',
            'questions', JSON_ARRAY(
                JSON_OBJECT(
                    'is_example', TRUE,
                    'question', 'Where''s May?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_example_a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_example_b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_example_c.png'
                    ),
                    'answer', 'C'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'What''s Nick doing?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_1a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_1b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_1c.png'
                    ),
                    'answer', 'B'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'Which animal does Sue like?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_2a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_2b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_2c.png'
                    ),
                    'answer', 'A'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'What''s Matt wearing?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_3a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_3b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_3c.png'
                    ),
                    'answer', 'C'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'What''s Pat having for dinner?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_4a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_4b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_4c.png'
                    ),
                    'answer', 'C'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'What colour is Grandma''s jacket?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_5a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_5b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part3_5c.png'
                    ),
                    'answer', 'B'
                )
            )
        ),
        'part4', JSON_OBJECT(
            'audio_url', '',
            'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/lis_part4.png',
            'coordinates', JSON_ARRAY(
                JSON_OBJECT(
                    'word', 'blue',
                    'x', 0.2125,
                    'y', 0.6406,
                    'width', 0.1307,
                    'height', 0.0376,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'orange',
                    'x', 0.7614,
                    'y', 0.9342,
                    'width', 0.1307,
                    'height', 0.0376,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'purple',
                    'x', 0.8366,
                    'y', 0.6833,
                    'width', 0.1307,
                    'height', 0.0376,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'yellow',
                    'x', 0.4935,
                    'y', 0.4235,
                    'width', 0.1307,
                    'height', 0.0376,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'pink',
                    'x', 0.5931,
                    'y', 0.2278,
                    'width', 0.1307,
                    'height', 0.0376,
                    'is_example', FALSE
                )
            )
        )
    ),
    JSON_OBJECT(
        'part1', JSON_ARRAY(
            JSON_OBJECT(
                'is_example', TRUE,
                'question', 'This is a polar bear.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part1_example_a.png',
                'status', 'wrong'
            ),
            JSON_OBJECT(
                'is_example', TRUE,
                'question', 'This is a shop.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part1_example_b.png',
                'status', 'right'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'question', 'This is a skirt.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part1_1.png',
                'status', 'wrong'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'question', 'These are dolls.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part1_2.png',
                'status', 'right'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'question', 'This is a bus.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part1_3.png',
                'status', 'right'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'question', 'These are apples.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part1_4.png',
                'status', 'wrong'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'question', 'This is a foot.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part1_5.png',
                'status', 'right'
            )
        ),
        'part2', JSON_OBJECT(
            'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part2.png',
            'questions', JSON_ARRAY(
                JSON_OBJECT(
                    'is_example', TRUE,
                    'question', 'The boy has got an ice cream.',
                    'status', 'yes'
                ),
                JSON_OBJECT(
                    'is_example', TRUE,
                    'question', 'The man is flying a kite.',
                    'status', 'no'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'The lizard is sitting under the tree.',
                    'status', 'no'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'The young girl is playing on the sand.',
                    'status', 'yes'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'There is some bread between the pineapple and the grapes.',
                    'status', 'yes'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'The young girl''s T-shirt is green and white.',
                    'status', 'no'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'There are a lot of shells in the water.',
                    'status', 'no'
                )
            )
        ),
        'part3', JSON_ARRAY(
            JSON_OBJECT(
                'is_example', TRUE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part3_example.png',
                'word', 'milk'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part3_1.png',
                'word', 'lime'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part3_2.png',
                'word', 'onion'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part3_3.png',
                'word', 'juice'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part3_4.png',
                'word', 'orange'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part3_5.png',
                'word', 'pineapple'
            )
        ),
        'part4', JSON_OBJECT(
            'text', 'Trees are very big. They are brown and (1) You find trees in a park or a (2) You do not find them in a room in a (3) Birds, small animals and (4) live in them. Boys and (5) like sitting under trees when it is hot.',
            'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part4.png',
            'options', JSON_ARRAY(
                JSON_OBJECT(
                    'word', 'brown',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part4_brown.png'
                ),
                JSON_OBJECT(
                    'word', 'girls',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part4_girls.png'
                ),
                JSON_OBJECT(
                    'word', 'burger',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part4_burger.png'
                ),
                JSON_OBJECT(
                    'word', 'spiders',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part4_spiders.png'
                ),
                JSON_OBJECT(
                    'word', 'green',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part4_green.png'
                ),
                JSON_OBJECT(
                    'word', 'picture',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part4_picture.png'
                ),
                JSON_OBJECT(
                    'word', 'garden',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part4_garden.png'
                ),
                JSON_OBJECT(
                    'word', 'house',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part4_house.png'
                )
            ),
            'answers', JSON_ARRAY(
                JSON_OBJECT(
                    'position', 1,
                    'word', 'green'
                ),
                JSON_OBJECT(
                    'position', 2,
                    'word', 'garden'
                ),
                JSON_OBJECT(
                    'position', 3,
                    'word', 'house'
                ),
                JSON_OBJECT(
                    'position', 4,
                    'word', 'spiders'
                ),
                JSON_OBJECT(
                    'position', 5,
                    'word', 'girls'
                )
            )
        ),
        'part5', JSON_ARRAY(
            JSON_OBJECT(
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part5_example.png',
                'questions', JSON_ARRAY(
                    JSON_OBJECT(
                        'is_example', TRUE,
                        'question', 'How many cars are there in the street?',
                        'answer_format', '[keyword]',
                        'keyword', 'one'
                    ),
                    JSON_OBJECT(
                        'is_example', TRUE,
                        'question', 'Where is the bus?',
                        'answer_format', 'behind the [keyword]',
                        'keyword', 'car'
                    ),
                    JSON_OBJECT(
                        'is_example', FALSE,
                        'question', 'Who is pointing at the watermelons?',
                        'answer_format', 'the [keyword]',
                        'keyword', 'woman',
                        'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part5_1.png'
                    ),
                    JSON_OBJECT(
                        'is_example', FALSE,
                        'question', 'Who is wearing glasses?',
                        'answer_format', 'the [keyword]',
                        'keyword', 'man',
                        'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test2/read_part5_2.png'
                    ),
                    JSON_OBJECT(
                        'is_example', FALSE,
                        'question', 'What has the boy got in his hand?',
                        'answer_format', 'a [keyword]',
                        'keyword', 'banana'
                    ),
                    JSON_OBJECT(
                        'is_example', FALSE,
                        'question', 'What colour is the cat?',
                        'answer_format', '[keyword] and white',
                        'keyword', 'black'
                    ),
                    JSON_OBJECT(
                        'is_example', FALSE,
                        'question', 'What are the birds eating?',
                        'answer_format', 'an [keyword]',
                        'keyword', 'apple'
                    )
                )
            )
        )
    ),
    0,
    NOW()
);