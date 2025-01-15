const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'attendance'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
  
  // Create database if it doesn't exist
  db.query('CREATE DATABASE IF NOT EXISTS lead_management', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database created or already exists');
    
    // Use the database
    db.query('USE lead_management', (err) => {
      if (err) {
        console.error('Error using database:', err);
        return;
      }
      
      // Create table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS leads (
          id INT AUTO_INCREMENT PRIMARY KEY,
          generationDate DATE,
          assigned BOOLEAN,
          eventName VARCHAR(255),
          eventDate DATE,
          hostedBy VARCHAR(255),
          pocNo VARCHAR(20),
          maharajji VARCHAR(255),
          location VARCHAR(255),
          salesPerson1 VARCHAR(255),
          salesPersonContact1 VARCHAR(20),
          salesPerson1Status VARCHAR(20),
          salesPerson2 VARCHAR(255),
          salesPersonContact2 VARCHAR(20)
        )
      `;
      
      db.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          return;
        }
        console.log('Table created or already exists');
      });
    });
  });
});

// API routes
app.get('/api/leads', (req, res) => {
  const query = 'SELECT * FROM leads';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching leads' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/leads', (req, res) => {
  const lead = req.body;
  const query = 'INSERT INTO leads SET ?';
  db.query(query, lead, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error adding lead' });
      return;
    }
    res.json({ id: result.insertId, ...lead });
  });
});

app.put('/api/leads/:id', (req, res) => {
  const id = req.params.id;
  const lead = req.body;
  const query = 'UPDATE leads SET ? WHERE id = ?';
  db.query(query, [lead, id], (err) => {
    if (err) {
      res.status(500).json({ error: 'Error updating lead' });
      return;
    }
    res.json({ id, ...lead });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

