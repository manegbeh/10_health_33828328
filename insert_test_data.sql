USE health;

-- REQUIRED TEST USER
INSERT INTO users (username, first, last, email, hashedPassword)
VALUES ('gold', 'Test', 'User', 'test@example.com', '$2b$10$EGfV4G3htmNQ2VhlPq7HkeYy7tY8DbDeihdj5Z8SGvtQvECOH14Qy');

-- SAMPLE MEALS
INSERT INTO meals (name, calories, protein)
VALUES
('Chicken Salad', 350, 30),
('Protein Smoothie', 220, 25),
('Pasta Bowl', 550, 15);

-- SAMPLE WORKOUTS (updated for activity + calories + time)
INSERT INTO workouts (name, activity, calories, time)
VALUES
('Jogging', 'running', 300, 30),
('Cycling', 'cycling', 450, 45),
('Skipping Rope', 'hiit', 250, 20);