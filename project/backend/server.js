const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const redis = require('redis');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// DB connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Redis connection
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'cache',   // use service name
    port: process.env.REDIS_PORT || 6379
  }
});

redisClient.on('error', err => console.error('Redis error', err));

(async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
})();



// About endpoint
// app.get('/about', (req, res) => {
//   res.json({ message: "This is a simple Dockerized app with Redis cache." });
// });

// Form submission
app.post('/submit', async (req, res) => {
  const { name, email } = req.body;
  try {
    await pool.query('INSERT INTO users(name, email) VALUES($1, $2)', [name, email]);
    // Invalidate cache
    await redisClient.del('users');
    res.send("Data saved!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data");
  }
});

// View all users with caching
app.get('/users', async (req, res) => {
  try {
    const cached = await redisClient.get('users');

    if (cached) {
      console.log("Serving from cache");
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query('SELECT * FROM users');
    await redisClient.set('users', JSON.stringify(result.rows), { EX: 60 }); // cache for 60s
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});
// Delete user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    // Invalidate cache
    await redisClient.del('users');
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));