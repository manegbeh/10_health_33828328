USE health;

INSERT INTO users (username, password)
VALUES ('gold', 'smiths');

-- SAMPLE MEALS
INSERT INTO meals (name, calories, protein)
VALUES
('Chicken Salad', 350, 30),
('Pasta Bowl', 500, 15),
('Protein Shake', 200, 25);

-- SAMPLE WORKOUTS
INSERT INTO workouts (name, sets, reps)
VALUES
('Bench Press', 4, 10),
('Squats', 5, 8),
('Deadlift', 3, 5);