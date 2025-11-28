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
  const name = req.sanitize(req.body.name)
  const sets = req.body.sets
  const reps = req.body.reps

  const sql = "INSERT INTO workouts (name, sets, reps) VALUES (?, ?, ?)"
  db.query(sql, [name, sets, reps], (err) => {
      if (err) return next(err)
      res.redirect("../workouts/list")
  })
})

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
  const id = req.params.id
  const name = req.sanitize(req.body.name)
  const sets = req.body.sets
  const reps = req.body.reps

  const sql = "UPDATE workouts SET name = ?, sets = ?, reps = ? WHERE id = ?"
  db.query(sql, [name, sets, reps, id], (err) => {
    if (err) return next(err)
    res.redirect('../workouts/list')
  })
})

// delete book
router.get('/delete/:id', redirectLogin, (req, res, next) => {
  const id = req.params.id
  const sql = "DELETE FROM workouts WHERE id = ?"
  db.query(sql, [id], (err) => {
    if (err) return next(err)
    res.redirect('../workouts/list')
  })
})

module.exports = router