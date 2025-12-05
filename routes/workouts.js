const express = require("express")
const router = express.Router()

const db = global.db

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('../auth/login')
    }
    next()
}

// list all workouts
router.get('/list', redirectLogin, function (req, res, next) {
  const sqlquery = "SELECT * FROM workouts"
  db.query(sqlquery, (err, result) => {
    if (err) return next(err)
    res.render("workouts/list", { workouts: result })
  })
})

// search form
router.get('/search', redirectLogin, function (req, res) {
  res.render("workouts/search")
})

// search results
router.get('/search-results', redirectLogin, function (req, res, next) {
  const term = req.sanitize(req.query.keyword || "")
  const sql = "SELECT * FROM workouts WHERE name LIKE ?"
  db.query(sql, [`%${term}%`], (err, result) => {
    if (err) return next(err)
    res.render("workouts/search_results", { workouts: result, term })
  })
})

// add form
router.get('/add', redirectLogin, (req, res) => {
  res.render('workouts/add')
})

// add submit
router.post('/add', redirectLogin, (req, res, next) => {
  const name = req.sanitize(req.body.name);
  const activity = req.sanitize(req.body.activity);

  const calories = parseInt(req.body.calories);
  const time = parseInt(req.body.time); // duration in seconds from timer

  // Validation to prevent NaN errors
  if (!name || !activity || isNaN(calories) || isNaN(time)) {
      console.log("Invalid workout data:", { name, activity, calories, time });
      return res.send("Error: Missing or invalid workout data. Please ensure the timer is stopped and calories are entered or auto-calculated.");
  }

  const sql = "INSERT INTO workouts (name, activity, calories, time) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, activity, calories, time], (err) => {
      if (err) return next(err);
      res.redirect("../workouts/list");
  });
});

// edit form
router.get('/edit/:id', redirectLogin, (req, res, next) => {
  const id = req.params.id
  const sql = "SELECT * FROM workouts WHERE id = ?"
  db.query(sql, [id], (err, result) => {
    if (err) return next(err)
    res.render("workouts/edit", { workout: result[0] })
  })
})

// edit submit
router.post('/edit/:id', redirectLogin, (req, res, next) => {
  const id = req.params.id;
  const name = req.sanitize(req.body.name);
  const activity = req.sanitize(req.body.activity);
  const calories = parseInt(req.body.calories);
  const time = parseInt(req.body.time);

  const sql = "UPDATE workouts SET name = ?, activity = ?, calories = ?, time = ? WHERE id = ?";
  db.query(sql, [name, activity, calories, time, id], (err) => {
    if (err) return next(err);
    res.redirect('../workouts/list');
  });
});

// delete book
router.get('/delete/:id', redirectLogin, (req, res, next) => {
  const id = req.params.id
  const sql = "DELETE FROM workouts WHERE id = ?"
  db.query(sql, [id], (err) => {
    if (err) return next(err)
    res.redirect('../workouts/list')
  })
})

// live workout timer page
router.get('/timer', redirectLogin, (req, res) => {
  res.render("workouts/timer");
});

// calculate calories using API Ninjas
router.post('/calcCalories', redirectLogin, async (req, res, next) => {
  const { activity, duration } = req.body;

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/caloriesburned?activity=${encodeURIComponent(activity)}`,
      {
        headers: { "X-Api-Key": "roX0ovymjZbhFZtAAAu3qQ==PMANEwsra9oGOOkh" }
      }
    );

    const data = await response.json();

    console.log("REQUEST BODY:", req.body);
    console.log("API RESPONSE:", data);

    if (!data || data.length === 0) {
      return res.json({ error: "Activity not found" });
    }

    const caloriesPerHour = data[0].calories_per_hour;
    const calories = (caloriesPerHour / 3600) * duration;

    res.json({ calories: Math.round(calories) });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to calculate calories" });
  }
});

module.exports = router