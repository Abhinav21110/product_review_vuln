/* 
 * INTENTIONALLY VULNERABLE SQL INJECTION TRAINING APPLICATION
 * FOR EDUCATIONAL USE ONLY - DO NOT EXPOSE TO INTERNET
 * 
 * This backend contains three intentional SQL injection vulnerabilities
 * for offline security training purposes.
 */

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const HOST = '127.0.0.1'; // localhost only

app.use(cors());
app.use(express.json());

// Initialize database
const db = new sqlite3.Database(':memory:');

// Generate random flags
function generateFlag() {
  return 'FLAG-' + crypto.randomBytes(8).toString('hex');
}

const FLAGS = {
  easy: generateFlag(),
  medium: generateFlag(),
  hard: generateFlag()
};

// Track found flags
const foundFlags = {
  easy: false,
  medium: false,
  hard: false
};

// Initialize database schema and seed data
db.serialize(() => {
  // Create tables
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    category TEXT,
    price TEXT,
    description TEXT
  )`);

  db.run(`CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    reviewer_name TEXT,
    rating INTEGER,
    review_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT,
    customer_name TEXT,
    complaint_text TEXT,
    status TEXT,
    flag_content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE legacy_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    note_content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE support_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    body TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed products
  const products = [
    [1, 'TechPhone Pro Max', 'Smartphones', '$999', 'Latest flagship smartphone with advanced features'],
    [2, 'UltraBook Air', 'Laptops', '$1,299', 'Lightweight laptop with powerful performance'],
    [3, 'WirelessBuds Elite', 'Audio', '$199', 'Premium wireless earbuds with noise cancellation'],
    [4, 'SmartWatch Series X', 'Wearables', '$399', 'Advanced smartwatch with health tracking'],
    [5, 'Gaming Laptop Pro', 'Laptops', '$1,799', 'High-performance gaming laptop with RTX graphics'],
    [6, 'Portable Charger Ultra', 'Accessories', '$79', '50000mAh power bank with fast charging']
  ];

  products.forEach(p => {
    db.run('INSERT INTO products VALUES (?, ?, ?, ?, ?)', p);
  });

  // Seed reviews - EASY FLAG is in one of these reviews
  const reviews = [
    [1, 'John Doe', 5, 'Amazing phone! Best purchase ever.'],
    [1, 'Jane Smith', 4, 'Great features but battery could be better.'],
    [1, 'Hacker101', 5, `Excellent device! ${FLAGS.easy}`], // VUL: Easy flag in review_text
    [2, 'Bob Johnson', 5, 'Perfect laptop for work and travel.'],
    [3, 'Alice Williams', 4, 'Sound quality is superb.'],
    [4, 'Charlie Brown', 3, 'Good but overpriced.']
  ];

  reviews.forEach(r => {
    db.run('INSERT INTO reviews (product_id, reviewer_name, rating, review_text) VALUES (?, ?, ?, ?)', r);
  });

  // Seed complaints - MEDIUM FLAG is stored in flag_content field
  const complaints = [
    ['TechPhone Pro Max', 'Sarah Davis', 'Screen cracked after minor drop', 'Open', null],
    ['UltraBook Air', 'Mike Wilson', 'Keyboard stopped working after 3 months', 'In Progress', null],
    ['WirelessBuds Elite', 'Emily Clark', 'Left earbud not charging properly', 'Resolved', null],
    ['SmartWatch Series X', 'David Lee', 'Heart rate monitor inaccurate', 'Open', FLAGS.medium] // VUL: Medium flag
  ];

  complaints.forEach(c => {
    db.run('INSERT INTO complaints (product_name, customer_name, complaint_text, status, flag_content) VALUES (?, ?, ?, ?, ?)', c);
  });

  // Seed legacy notes - HARD FLAG is here
  db.run('INSERT INTO legacy_notes (note_content) VALUES (?)', [`Legacy system migration notes - confidential`]);
  db.run('INSERT INTO legacy_notes (note_content) VALUES (?)', [`Internal reference: ${FLAGS.hard}`]); // VUL: Hard flag
  db.run('INSERT INTO legacy_notes (note_content) VALUES (?)', [`Archive: Customer service protocols 2020`]);

  console.log('\n=================================');
  console.log('🚨 TRAINING LAB INITIALIZED 🚨');
  console.log('=================================');
  console.log('\nFLAGS (for verification only):');
  console.log('Easy:  ', FLAGS.easy);
  console.log('Medium:', FLAGS.medium);
  console.log('Hard:  ', FLAGS.hard);
  console.log('\n⚠️  DO NOT EXPOSE TO INTERNET ⚠️');
  console.log('Listening on http://127.0.0.1:3000');
  console.log('=================================\n');
});

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Get product reviews - filter out reviews containing flags in normal response
app.get('/api/products/:id/reviews', (req, res) => {
  db.all('SELECT id, product_id, reviewer_name, rating, review_text, created_at FROM reviews WHERE product_id = ? AND review_text NOT LIKE \'%FLAG-%\' ORDER BY created_at DESC', 
    [req.params.id], 
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Add review
app.post('/api/products/:id/reviews', (req, res) => {
  const { reviewer_name, review_text, rating } = req.body;
  db.run(
    'INSERT INTO reviews (product_id, reviewer_name, rating, review_text) VALUES (?, ?, ?, ?)',
    [req.params.id, reviewer_name, rating, review_text],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// VUL: EASY - Reflected SQL Injection in search
// Intentionally vulnerable - concatenates user input directly into SQL
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  
  // VUL: intentional SQLi - no parameterization
  const sql = `SELECT * FROM reviews WHERE review_text LIKE '%${query}%'`;
  
  db.all(sql, (err, rows) => {
    if (err) {
      console.log('SQL Error (expected in training):', err.message);
      return res.json([]);
    }
    res.json(rows || []);
  });
});

// Get all complaints
app.get('/api/complaints', (req, res) => {
  db.all('SELECT id, product_name, customer_name, complaint_text, status, created_at FROM complaints ORDER BY created_at DESC', 
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// VUL: MEDIUM - Boolean-based Blind SQL Injection
// Intentionally vulnerable - concatenates id directly
app.get('/api/complaints/:id', (req, res) => {
  const id = req.params.id;
  
  // VUL: intentional SQLi - allows boolean-based blind injection
  const sql = `SELECT * FROM complaints WHERE id = ${id}`;
  
  db.get(sql, (err, row) => {
    if (err) {
      console.log('SQL Error (expected in training):', err.message);
      return res.json({ found: false });
    }
    
    if (row) {
      res.json({ 
        found: true, 
        complaint: {
          id: row.id,
          product_name: row.product_name,
          customer_name: row.customer_name,
          complaint_text: row.complaint_text,
          status: row.status,
          created_at: row.created_at
        }
      });
    } else {
      res.json({ found: false });
    }
  });
});

// Submit support ticket - stores data for second-order SQLi
app.post('/api/support/ticket', (req, res) => {
  const { title, body } = req.body;
  
  // Store ticket - this data can be used for second-order injection
  db.run(
    'INSERT INTO support_tickets (title, body) VALUES (?, ?)',
    [title, body],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// VUL: HARD - Second-order SQL Injection
// Uses data from support tickets in an unsafe way to query legacy notes
app.get('/api/support/legacy-note/:id', (req, res) => {
  const noteId = req.params.id;
  
  // First, get a support ticket (this could contain injected payload)
  db.get('SELECT * FROM support_tickets ORDER BY id DESC LIMIT 1', (err, ticket) => {
    if (err || !ticket) {
      // Fallback to direct query if no ticket
      // VUL: intentional SQLi - direct concatenation
      const sql = `SELECT * FROM legacy_notes WHERE id = ${noteId}`;
      
      db.get(sql, (err, row) => {
        if (err) {
          console.log('SQL Error (expected in training):', err.message);
          return res.json({ found: false });
        }
        
        if (row) {
          res.json({ found: true, content: row.note_content });
        } else {
          res.json({ found: false });
        }
      });
      return;
    }
    
    // VUL: Second-order SQLi - uses ticket title in unsafe query
    // If ticket title contains SQL, it will be executed here
    const sql = `SELECT * FROM legacy_notes WHERE note_content LIKE '%${ticket.title}%' OR id = ${noteId}`;
    
    db.get(sql, (err, row) => {
      if (err) {
        console.log('SQL Error (expected in training):', err.message);
        return res.json({ found: false });
      }
      
      if (row) {
        res.json({ found: true, content: row.note_content });
      } else {
        res.json({ found: false });
      }
    });
  });
});


// Start server - LOCALHOST ONLY
app.listen(PORT, HOST, () => {
  // Server startup is handled in db.serialize callback above
});
