const express = require("express")
const router = express.Router()

const db = global.db

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('../auth/login')
    }
    next()
}

// list all meals
router.get('/list', redirectLogin, function (req, res, next) {
  const sqlquery = "SELECT * FROM meals"
  db.query(sqlquery, (err, result) => {
    if (err) return next(err)
    res.render("meals/list", { meals: result })
  })
})

// search form
router.get('/search', redirectLogin, function (req, res) {
  res.render("meals/search")
})

// search results
router.get('/search-results', redirectLogin, function (req, res, next) {
  const term = req.sanitize(req.query.keyword || "")
  const sql = "SELECT * FROM meals WHERE name LIKE ?"
  db.query(sql, [`%${term}%`], (err, result) => {
    if (err) return next(err)
    res.render("meals/search_results", { meals: result, term })
  })
})

// add form
router.get('/add', redirectLogin, (req, res) => {
  res.render('meals/add')
})

// add submit
router.post('/add', redirectLogin, (req, res, next) => {
  const name = req.sanitize(req.body.name)
  const calories = req.body.calories
  const protein = req.body.protein

  const sql = "INSERT INTO meals (name, calories, protein) VALUES (?, ?, ?)"
  db.query(sql, [name, calories, protein], (err) => {
      if (err) return next(err)
      res.redirect("../meals/list")
  })
})

// edit form
router.get('/edit/:id', redirectLogin, (req, res, next) => {
  const id = req.params.id
  const sql = "SELECT * FROM meals WHERE id = ?"
  db.query(sql, [id], (err, result) => {
    if (err) return next(err)
    res.render("meals/edit", { meal: result[0] })
  })
})

// edit submit
router.post('/edit/:id', redirectLogin, (req, res, next) => {
  const id = req.params.id
  const name = req.sanitize(req.body.name)
  const calories = req.body.calories
  const protein = req.body.protein


  const sql = "UPDATE meals SET name = ?, calories = ?, protein = ? WHERE id = ?"
  db.query(sql, [name, calories, protein, id], (err) => {
    if (err) return next(err)
    res.redirect('../meals/list')
  })
})

// delete book
router.get('/delete/:id', redirectLogin, (req, res, next) => {
  const id = req.params.id
  const sql = "DELETE FROM meals WHERE id = ?"
  db.query(sql, [id], (err) => {
    if (err) return next(err)
    res.redirect('../meals/list')
  })
})

module.exports = router