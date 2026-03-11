const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.get('/about', (req, res) => {
  res.json({ message: "This is a simple Dockerized app." });
});

app.post('/submit', async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query('INSERT INTO users(name, email) VALUES($1, $2)', [name, email]);
    res.send("Data saved!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data");
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));