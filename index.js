const express = require("express");
const ejs = require("ejs");
const path = require("path");
const mysql = require("mysql2");
const session = require("express-session");
const expressSanitizer = require("express-sanitizer");

const app = express();
const port = process.env.PORT || 8000;

const db = mysql.createPool({
  host: process.env.FF_HOST || process.env.DB_HOST || "localhost",
  user: process.env.HEALTH_USER || "health_app",
  password: process.env.HEALTH_PASSWORD || "qwertyuiop",
  database: process.env.HEALTH_DATABASE || "health",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
global.db = db;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(expressSanitizer());

app.use(
  session({
    secret: "somerandomstuff",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.locals.shopData = { shopName: "Lift Logix" };

// Routes
app.use("/", require("./routes/main"));
app.use("/audit", require("./routes/audit.js"));
app.use("/auth", require("./routes/auth"));
app.use("/meals", require("./routes/meals"));
app.use("/workouts", require("./routes/workouts"));


// Start server
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
