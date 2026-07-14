const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Serve static files
app.use("/public", express.static(path.join(__dirname, "../public")));

// In-memory store (for demo)
const students = [];

// Home page: form + preview
app.get("/", (req, res) => {
  res.render("index");
});

// Submit  form (server-side validation)
app.post("/submit", (req, res) => {
  const { name, email, course, phone } = req.body;
  // Server side validation
  if (!name || !email || !course) {
    return res.status(400).send("Name, email and course are required.");
  }
  if (!email.includes("@")) {
    return res.status(400).send("Invalid email.");
  }
  const student = { id: students.length + 1, name, email, course, phone };
  students.push(student);
  res.render("success", { student });
});

// API endpoints (Task 5)
app.post("/api/students", (req, res) => {
  const { name, email, course, phone } = req.body;
  if (!name || !email || !course) {
    return res.status(400).json({ error: "name, email, course required" });
  }
  const student = { id: students.length + 1, name, email, course, phone };
  students.push(student);
  res.json({ message: "Saved", student });
});

app.get("/api/students", (req, res) => {
  res.json(students);
});

// small endpoint to fetch single student
app.get("/api/students/:id", (req, res) => {
  const s = students.find(x => x.id === Number(req.params.id));
  if (!s) return res.status(404).json({ error: "Not found" });
  res.json(s);
});



module.exports=app;
