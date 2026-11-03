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
    'Collins 2018 - Test 3',
    'Test 3 trong bộ đề thi do Collins 2018 xuất bản',
    'Pre-A1',
    20,
    20,
    20,
    25,
    JSON_OBJECT(
        'part1', JSON_OBJECT(
            'audio_url', '',
            'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part1.png',
            'coordinates', JSON_ARRAY(
                JSON_OBJECT(
                    'word', 'Ben',
                    'x', 0.0353,
                    'y', 0.8163,
                    'width', 0.12,
                    'height', 0.0434,
                    'is_example', TRUE
                ),
                JSON_OBJECT(
                    'word', 'Mark',
                    'x', 0.1453,
                    'y', 0.6326,
                    'width', 0.12,
                    'height', 0.0434,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'Alex',
                    'x', 0.464,
                    'y', 0.67,
                    'width', 0.12,
                    'height', 0.0434,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'Sam',
                    'x', 0.369,
                    'y', 0.8257,
                    'width', 0.12,
                    'height', 0.0434,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'May',
                    'x', 0.5428,
                    'y', 0.6097,
                    'width', 0.12,
                    'height', 0.0434,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'Ann',
                    'x', 0.6665,
                    'y', 0.5505,
                    'width', 0.12,
                    'height', 0.0434,
                    'is_example', FALSE
                )
            )
        ),
        'part2', JSON_OBJECT(
            'audio_url', '',
            'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part2.png',
            'questions', JSON_ARRAY(
                JSON_OBJECT(
                    'is_example', TRUE,
                    'question', 'How old is May?',
                    'answer_format', '[keyword]',
                    'keyword', '7'
                ),
                JSON_OBJECT(
                    'is_example', TRUE,
                    'question', 'What''s May''s grandma''s name?',
                    'answer_format', '[keyword]',
                    'keyword', 'Anna'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'How old is Nick?',
                    'answer_format', '[keyword]',
                    'keyword', '8'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'What''s Nick''s sister''s name?',
                    'answer_format', '[keyword]',
                    'keyword', 'Kim'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'How old is Nick''s sister?',
                    'answer_format', '[keyword]',
                    'keyword', '9'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'How many eggs are in the box?',
                    'answer_format', '[keyword]',
                    'keyword', '4'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'What''s Grandpa''s name?',
                    'answer_format', '[keyword]',
                    'keyword', 'Tom'
                )
            )
        ),
        'part3', JSON_OBJECT(
            'audio_url', '',
            'questions', JSON_ARRAY(
                JSON_OBJECT(
                    'is_example', TRUE,
                    'question', 'What''s Lucy eating?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_example_a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_example_b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_example_c.png'
                    ),
                    'answer', 'C'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'Which is Bill''s house?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_1a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_1b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_1c.png'
                    ),
                    'answer', 'B'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'How is Sue getting to school today?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_2a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_2b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_2c.png'
                    ),
                    'answer', 'A'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'What can Ben see?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_3a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_3b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_3c.png'
                    ),
                    'answer', 'A'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'What colour are Ann''s eyes?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_4a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_4b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_4c.png'
                    ),
                    'answer', 'C'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'What sport is Mark playing?',
                    'img_urls', JSON_ARRAY(
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_5a.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_5b.png',
                        'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part3_5c.png'
                    ),
                    'answer', 'B'
                )
            )
        ),
        'part4', JSON_OBJECT(
            'audio_url', '',
            'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/lis_part4.png',
            'coordinates', JSON_ARRAY(
                JSON_OBJECT(
                    'word', 'red',
                    'x', 0.0976,
                    'y', 0.5615,
                    'width', 0.12,
                    'height', 0.0434,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'yellow',
                    'x', 0.7698,
                    'y', 0.6555,
                    'width', 0.12,
                    'height', 0.0434,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'green',
                    'x', 0.6078,
                    'y', 0.4704,
                    'width', 0.12,
                    'height', 0.0434,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'brown',
                    'x', 0.2484,
                    'y', 0.4675,
                    'width', 0.12,
                    'height', 0.0434,
                    'is_example', FALSE
                ),
                JSON_OBJECT(
                    'word', 'purple',
                    'x', 0.1274,
                    'y', 0.3912,
                    'width', 0.12,
                    'height', 0.0434,
                    'is_example', FALSE
                )
            )
        )
    ),
    JSON_OBJECT(
        'part1', JSON_ARRAY(
            JSON_OBJECT(
                'is_example', TRUE,
                'question', 'This is a face.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part1_example_a.png',
                'status', 'right'
            ),
            JSON_OBJECT(
                'is_example', TRUE,
                'question', 'This is a flat.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part1_example_b.png',
                'status', 'wrong'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'question', 'This is a page.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part1_1.png',
                'status', 'right'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'question', 'This is a radio.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part1_2.png',
                'status', 'right'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'question', 'These are baths.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part1_3.png',
                'status', 'wrong'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'question', 'These are trains.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part1_4.png',
                'status', 'right'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'question', 'This is a beach.',
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part1_5.png',
                'status', 'wrong'
            )
        ),
        'part2', JSON_OBJECT(
            'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part2.png',
            'questions', JSON_ARRAY(
                JSON_OBJECT(
                    'is_example', TRUE,
                    'question', 'The woman with brown hair has got some rice and chicken.',
                    'status', 'yes'
                ),
                JSON_OBJECT(
                    'is_example', TRUE,
                    'question', 'The girl is wearing black shorts.',
                    'status', 'no'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'The man is talking on the phone.',
                    'status', 'yes'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'The shop door is closed.',
                    'status', 'no'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'There is some bread and fruit behind the woman with blonde hair.',
                    'status', 'yes'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'The girl has got long brown hair.',
                    'status', 'yes'
                ),
                JSON_OBJECT(
                    'is_example', FALSE,
                    'question', 'The young boy is playing with his sock.',
                    'status', 'no'
                )
            )
        ),
        'part3', JSON_ARRAY(
            JSON_OBJECT(
                'is_example', TRUE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part3_example.png',
                'word', 'chair'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part3_1.png',
                'word', 'desk'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part3_2.png',
                'word', 'ruler'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part3_3.png',
                'word', 'rubber'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part3_4.png',
                'word', 'computer'
            ),
            JSON_OBJECT(
                'is_example', FALSE,
                'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part3_5.png',
                'word', 'cupboard'
            )
        ),
        'part4', JSON_OBJECT(
            'text', 'This doll has got a face, two eyes, a nose and a (1). He has got two arms but he cannot throw a (2). He has got two (3) but he cannot run or jump. He lives in a (4) in a house. Young (5) play with him.',
            'options', JSON_ARRAY(
                JSON_OBJECT(
                    'word', 'face',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part4_face.png'
                ),
                JSON_OBJECT(
                    'word', 'mouth',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part4_mouth.png'
                ),
                JSON_OBJECT(
                    'word', 'ear',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part4_ear.png'
                ),
                JSON_OBJECT(
                    'word', 'children',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part4_children.png'
                ),
                JSON_OBJECT(
                    'word', 'ball',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part4_ball.png'
                ),
                JSON_OBJECT(
                    'word', 'bedroom',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part4_bedroom.png'
                ),
                JSON_OBJECT(
                    'word', 'kitchen',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part4_kitchen.png'
                ),
                JSON_OBJECT(
                    'word', 'legs',
                    'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part4_legs.png'
                )
            ),
            'answers', JSON_ARRAY(
                JSON_OBJECT(
                    'position', 1,
                    'word', 'mouth'
                ),
                JSON_OBJECT(
                    'position', 2,
                    'word', 'ball'
                ),
                JSON_OBJECT(
                    'position', 3,
                    'word', 'legs'
                ),
                JSON_OBJECT(
                    'position', 4,
                    'word', 'bedroom'
                ),
                JSON_OBJECT(
                    'position', 5,
                    'word', 'children'
                )
            )
        ),
		   'part5', JSON_ARRAY(
		    JSON_OBJECT(
		        'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part5_example.png',
		        'questions', JSON_ARRAY(
		            JSON_OBJECT(
		                'is_example', TRUE,
		                'question', 'Who is driving the car?',
		                'answer_format', 'the [keyword]',
		                'keyword', 'man'
		            ),
		            JSON_OBJECT(
		                'is_example', TRUE,
		                'question', 'What time of day is it?',
		                'answer_format', '[keyword]',
		                'keyword', 'day'
		            ),
		            JSON_OBJECT(
		                'is_example', FALSE,
		                'question', 'How many people are in the car?',
		                'answer_format', '[keyword]',
		                'keyword', 'four'
		            )
		        )
		    ),
		    JSON_OBJECT(
		        'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part5_1.png',
		        'questions', JSON_ARRAY(
		            JSON_OBJECT(
		                'is_example', FALSE,
		                'question', 'What is Mum doing?',
		                'answer_format', '[keyword]',
		                'keyword', 'painting'
		            ),
		            JSON_OBJECT(
		                'is_example', FALSE,
		                'question', 'What is the boy looking at?',
		                'answer_format', 'a [keyword]',
		                'keyword', 'spider'
		            )
		        )
		    ),
		    JSON_OBJECT(
		        'img_url', 'https://minhchau-22662231-bucket.s3.ap-southeast-1.amazonaws.com/session-items/Exam/Collins_Test3/read_part5_2.png',
		        'questions', JSON_ARRAY(
		            JSON_OBJECT(
		                'is_example', FALSE,
		                'question', 'What has the bird got?',
		                'answer_format', 'a [keyword]',
		                'keyword', 'fish'
		            ),
		            JSON_OBJECT(
		                'is_example', FALSE,
		                'question', 'Who is pointing at the bird?',
		                'answer_format', 'the [keyword]',
		                'keyword', 'girl'
		            )
		        )
		    )
		)
    ),
    0,
    NOW()
);