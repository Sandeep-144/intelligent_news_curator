const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5501;

// Enable CORS and handle preflight for /signup and /signin
app.use(cors());
app.options('/signup', cors());
app.options('/signin', cors());

// Parse JSON bodies
app.use(bodyParser.json());

app.post('/add-interest', (req, res) => {
  const { username, category } = req.body;
  if (!username || !category) {
    return res.status(400).json({ success: false, message: 'Username and category required' });
  }

  db.query(
    'SELECT * FROM user_interests WHERE username = ? AND category = ?',
    [username, category],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'DB error' });

      if (results.length > 0) {
        return res.status(409).json({ success: false, message: 'Interest already exists' });
      }

      db.query(
        'INSERT INTO user_interests (username, category) VALUES (?, ?)',
        [username, category],
        err => {
          if (err) return res.status(500).json({ success: false, message: 'DB error' });
          res.json({ success: true });
        }
      );
    }
  );
});

// Serve static files from 'public' folder
app.use(express.static('public'));

// MySQL setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'S@2004#pmC',
  database: 'newsapp'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL');
});

// Signup route (handles POST and preflight)
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    if (results.length > 0) return res.status(409).json({ success: false, message: 'Username exists' });

    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password],
      err => {
        if (err) return res.status(500).json({ success: false, message: 'DB error' });
        res.json({ success: true });
      }
    );
  });
});

// Signin route
app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'DB error' });
      if (results.length > 0) {
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  );
});

app.get('/interests/:username', (req, res) => {
  const username = req.params.username;

  db.query('SELECT category FROM user_interests WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });

    const categories = results.map(row => row.category);
    res.json({ success: true, categories });
  });
});

// Start server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));