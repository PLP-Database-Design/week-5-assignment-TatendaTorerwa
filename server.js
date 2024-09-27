// Server setup
const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

// Load environment variables from .env file
dotenv.config();

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Checking the database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to Mysql');
    return;
  }
  console.log('Connected to the database');
});


// Middleware to handle incoming requests
// 1. Parses incoming JSON requests, making the JSON data accessible in req.body
// 2. Enables Cross-Origin Resource Sharing (CORS), allowing requests from different origins to access the server's resources
app.use(express.json());
app.use(cors());

/**
* Retrieve all patients with selected attributes
* GET /patients
*/

app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving patients');
    } else {
      res.json(results);
    }
  });
});

/**
* Retrieve all providers
* GET /providers
*/
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving providers');
    } else {
      res.json(results);
    }
  });
});

/**
* Filter patients by first_name
* GET /patients?first_name=<name>
*/
app.get('/patients', (req, res) => {
  const { first_name } = req.query;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, [first_name], (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving patients');
    } else {
      res.json(results);
    }
  });
});

/**
* Retrieve all providers bt their specialty
* GET /providers?specialty=<specialty>
*/
app.get('providers', (req, res) => {
  const { specialty } = req.query;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving providers');
    } else {
      res.json(results);
    }
  });
});

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})  
