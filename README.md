# HEALTH APP

A full-stack fitness and wellbeing application built with **Node.js**, **Express**, **EJS**, and **MySQL**.  
The app allows users to track workouts using a live timer, automatically calculate calories using an external API, record meals, and manage personal fitness data through a secure login system.

---

## Features

### User Authentication
- Login system using hashed passwords (bcrypt)

### Workout Tracking
- Add, edit, delete, and list workouts
- Live timer with `HH:MM:SS` tracking
- Auto-calculation of calories burned based on:
  - Activity type (running, walking, cycling, etc.)
  - Workout duration (from the timer)
  - External **Calories Burned API** (API Ninjas)

### Meals Tracking
- Add meals with name, calories, and protein
- View logged meals

### Search Functionality
- Search workouts by name/activity
- Search meals by name
- Required by coursework specification

### Database Support
Uses a MySQL database named **`health`**, created through the provided SQL scripts:
- `create_db.sql`
- `insert_test_data.sql`

---

## Installation

### 1. Clone the repository
```
git clone <your-repo-url>
cd 10_health_33828328
```

### 2. Install dependencies
```
npm install
```

### 3. Set up the database
Import both SQL files using phpMyAdmin or MySQL CLI:

```
create_db.sql
insert_test_data.sql
```

This creates:

- `users`
- `workouts`
- `meals`
- `audit`

---

## 🗂 SQL Test User

Required for login:

```
username: gold
password: smiths
```

Password is stored as a bcrypt hash in the `users` table.

---

## Running the App

Start the server:

```
node index.js
```

The app will run at:

```
http://localhost:8000/
```

---

## Environment Variables (if using dotenv)

```
HEALTH_HOST=localhost
HEALTH_USER=health_app
HEALTH_PASSWORD=qwertyuiop
HEALTH_DATABASE=health
HEALTH_BASE_PATH=http://localhost:8000
```

---

## Important Links (for deployed version and testing)

Listed in `links.txt`:
- Home
- About
- Workouts (list, add, edit, timer, search)
- Meals (list, add)
- Login / Logout
- Register

---

## Advanced Features (meets coursework "additional functionality")

### External API Integration
Calories automatically calculated using:
- API Ninjas Calories Burned API  
- Activity + duration → calorie estimation

### Live JavaScript Timer
- Millisecond‑accurate stopwatch  
- Outputs time in seconds to the backend  
- Integrated with calorie calculation  

### Input Sanitization
All user inputs sanitized using `express-sanitizer`.
