USE health;

-- REQUIRED TEST USER
INSERT INTO users (username, first, last, email, hashedPassword)
VALUES ('gold', 'Test', 'User', 'test@example.com', '$2a$10$PLACEHOLDERHASH');

-- SAMPLE MEALS
INSERT INTO meals (name, calories, protein)
VALUES
('Chicken Salad', 350, 30),
('Protein Smoothie', 220, 25),
('Pasta Bowl', 550, 15);

-- SAMPLE WORKOUTS (updated for calories + time)
INSERT INTO workouts (name, calories, time)
VALUES
('Jogging', 300, 30),
('Cycling', 450, 45),
('Skipping Rope', 250, 20);