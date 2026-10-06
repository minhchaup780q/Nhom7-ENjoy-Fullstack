package com.example.learningservice.repositories;

import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * Class này đóng vai trò như một bảng Vocabulary trong CSDL (Mock DB).
 * Chứa sẵn dữ liệu mapping giữa Từ vựng và Topic.
 */
@Repository
public class MockVocabularyRepository {

    // Giả lập bảng trong CSDL: lưu mapping (Từ vựng -> Topic) để truy vấn cho lẹ
    private static final Map<String, String> VOCAB_DB = new HashMap<>();

    static {
        // Hàm helper để nạp data vào VOCAB_DB
        // 1. Animals
        addVocabData("Animals", "animal, hippo, bear, horse, bee, jellyfish, bird, lizard, cat, monkey, chicken, mouse, mice, cow, pet, crocodile, polar bear, dog, sheep, donkey, snake, duck, spider, elephant, tail, fish, tiger, frog, zebra, giraffe, zoo, goat");

        // 2. The body and the face
        addVocabData("The body and the face", "arm, hand, body, head, ear, leg, eye, face, mouth, nose, foot, feet, smile, hair, tooth, teeth");

        // 3. Clothes
        addVocabData("Clothes", "bag, baseball cap, shoe, shorts, boots, skirt, clothes, sock, dress, trousers, glasses, t-shirt, handbag, wear, hat, jacket, jeans, shirt");

        // 4. Colours
        addVocabData("Colours", "black, orange, blue, pink, brown, purple, colour, color, gray, grey, red, white, green, yellow");

        // 5. Family & friends
        addVocabData("Family & friends", "baby, boy, grandmother, grandpa, brother, child, children, classmate, cousin, mother, dad, mum, family, old, father, person, people, friend, sister, girl, woman, women, grandfather, young, grandma");

        // 6. Food & drink
        addVocabData("Food & drink", "apple, banana, juice, kiwi, bean, lemon, bread, lemonade, breakfast, lime, burger, lunch, cake, mango, candy, sweet, sweets, meat, meatballs, carrot, milk, chicken, onion, chips, fries, orange, chocolate, pea, coconut, pear, dinner, pie, drink, pineapple, eat, potato, egg, rice, fish, sausage, food, fruit, tomato, grape, water, ice cream, watermelon");

        // 7. The home
        addVocabData("The home", "apartment, flat, house, armchair, kitchen, bath, lamp, bathroom, living room, bed, mat, bedroom, mirror, bookcase, phone, box, picture, camera, radio, chair, room, clock, rug, computer, sleep, cupboard, sofa, desk, table, dining room, television, tv, doll, toy, door, tree, flower, wall, garden, watch, hall, window, home");

        // 8. Materials
        addVocabData("Materials", "paper");

        // 9. Names
        addVocabData("Names", "alex, lucy, alice, mark, ann, anna, matt, ben, may, bill, nick, dan, pat, eva, sam, grace, sue, hugo, tom, jill, kim");

        // 10. Numbers
        addVocabData("Numbers", "one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20");

        // 11. Places & directions
        addVocabData("Places & directions", "behind, between, end, here, in, in front of, on, park, playground, shop, store, street, there, under, zoo");

        // 12. School
        addVocabData("School", "alphabet, music, answer, number, ask, open, board, page, book, painting, bookcase, paper, class, part, classroom, pen, close, pencil, colour, color, picture, computer, playground, correct, poster, crayon, question, cross, read, cupboard, right, desk, rubber, eraser, door, ruler, draw, school, english, sentence, sit, example, spell, find, stand, floor, story, keyboard, teacher, learn, tell, lesson, tick, letter, understand, line, wall, listen, window, look, word, mouse, write");

        // 13. Sports & leisure
        addVocabData("Sports & leisure", "badminton, listen, ball, music, baseball, photo, basketball, piano, bat, picture, beach, play, bike, radio, boat, read, book, ride, bounce, run, camera, sing, catch, skateboard, doll, skateboarding, draw, soccer, football, drawing, song, drive, sport, enjoy, story, favourite, favorite, swim, fishing, table tennis, fly, take a photo, take a picture, television, tv, game, tennis, guitar, tennis racket, hobby, throw, hockey, toy, jump, kick, walk, kite, watch");

        // 14. Time
        addVocabData("Time", "afternoon, birthday, clock, day, evening, in, morning, night, today, watch, year");

        // 15. Toys
        addVocabData("Toys", "alien, helicopter, ball, lorry, truck, balloon, monster, baseball, motorbike, basketball, plane, bike, robot, board game, soccer, football, boat, teddy, teddy bear, car, toy, doll, train, game");

        // 16. Transport
        addVocabData("Transport", "bike, motorbike, boat, plane, bus, ride, car, run, drive, ship, fly, swim, go, train, helicopter, truck, lorry");

        // 17. Weather
        addVocabData("Weather", "sun");

        // 18. Work
        addVocabData("Work", "teacher");

        // 19. The world around us
        addVocabData("The world around us", "beach, sand, sea, shell, street, sun, tree, water");
    }

    private static void addVocabData(String topic, String rawWords) {
        String[] words = rawWords.split(",");
        for (String w : words) {
            String cleanWord = w.trim().toLowerCase();
            if (!cleanWord.isEmpty()) {
                VOCAB_DB.put(cleanWord, topic);
            }
        }
    }

    /**
     * Giả lập câu lệnh: SELECT topic FROM vocab WHERE word = ?
     */
    public String findTopicByWord(String word) {
        if (word == null) return null;
        return VOCAB_DB.get(word.trim().toLowerCase());
    }

    /**
     * Lấy toàn bộ từ vựng nếu cần thiết (SELECT * FROM vocab)
     */
    public Map<String, String> findAll() {
        return Collections.unmodifiableMap(VOCAB_DB);
    }
}
