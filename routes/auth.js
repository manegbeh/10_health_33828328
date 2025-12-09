const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = global.db;
const saltRounds = 10;
const { check, validationResult } = require("express-validator");


const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('../auth/login');
    } else {
        next();
    }
};


router.get('/register', function (req, res) {
    res.render('auth/register', { 
        shopData: req.app.locals.shopData,
        errors: []
    });
});


router.post(
    '/registered',
    [
        check('email').isEmail().withMessage("Enter a valid email"),
        check('username').isLength({ min: 4, max: 20 }).withMessage("Username must be 5–20 characters"),
        check('password').isLength({ min: 6 }).withMessage("Password must be at least 8 characters")
    ],
    function (req, res, next) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('auth/register', { 
                shopData: req.app.locals.shopData,
                errors: errors.array()
            });
        }
        const first = req.sanitize(req.body.first);
        const last = req.sanitize(req.body.last);
        const email = req.sanitize(req.body.email);
        const username = req.sanitize(req.body.username);
        const plainPassword = req.sanitize(req.body.password);


        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
            if (err) return next(err);

            const sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";

            db.query(sqlquery, [username, first, last, email, hashedPassword], (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        db.query("INSERT INTO audit_log (action) VALUES (?)",
                            [`Failed registration (duplicate): ${username}`]);
                        return res.render("auth/registered", { 
                            shopData: req.app.locals.shopData,
                            first: null,
                            last: null,
                            email: null,
                            message: "Registration failed: Username or email already exists."
                        });
                    }
                    return next(err);
                }

                db.query("INSERT INTO audit_log (action) VALUES (?)",
                    [`User registered: ${username}`]);

                return res.render("auth/registered", {
                    shopData: req.app.locals.shopData,
                    first,
                    last,
                    email,
                    message: "Registration successful!"
                });
            });
        });
    }
);


router.get('/list', redirectLogin, function (req, res, next) {
    const sqlquery = "SELECT username, first, last, email FROM users";
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("auth/list", { users: result });
    });
});


router.get('/login', function (req, res) {
    res.render('auth/login');
});


router.post('/loggedin', function (req, res, next) {

    const username = req.sanitize(req.body.username);
    const password = req.sanitize(req.body.password);


    const sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, result) => {
        if (err) return next(err);

        if (result.length === 0) {
            db.query("INSERT INTO audit_log (action) VALUES (?)",
                [`Failed login (unknown user): ${username}`]);

            return res.render("auth/loggedin", { 
                username: null,
                message: "Login failed: Username does not exist."
            });
        }

        const hashedPassword = result[0].hashedPassword;

        bcrypt.compare(password, hashedPassword, function (err, match) {
            if (err) return next(err);

            if (match === true) {

                // REQUIRED FOR LAB 8:
                req.session.userId = username;

                db.query("INSERT INTO audit_log (action) VALUES (?)",
                    [`User logged in: ${username}`]);

                return res.render("auth/loggedin", { 
                    username: username,
                    message: "Login successful!"
                });
            } else {

                db.query("INSERT INTO audit_log (action) VALUES (?)",
                    [`Failed login (wrong password): ${username}`]);

                return res.render("auth/loggedin", { 
                    username: null,
                    message: "Login failed: Incorrect password."
                });
            }
        });
    });
});

router.get('/logout', function (req, res) {
    req.session.destroy(() => {
        res.render('auth/logout', {
            shopData: req.app.locals.shopData
        });
    });
});

module.exports = router;
