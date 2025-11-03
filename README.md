# SQL Injection Training Lab

## ⚠️ CRITICAL SECURITY WARNING ⚠️

**THIS APPLICATION IS INTENTIONALLY VULNERABLE FOR EDUCATIONAL PURPOSES ONLY**

- **DO NOT DEPLOY TO THE INTERNET**
- **DO NOT EXPOSE TO YOUR NETWORK**
- **LOCALHOST USE ONLY (127.0.0.1)**
- Contains deliberate SQL injection vulnerabilities for learning purposes
- Designed for offline security training and CTF-style challenges

## Purpose

This is an educational web application designed to teach SQL injection concepts through hands-on practice. The application simulates a customer tech product complaints and reviews site with three intentional SQL injection vulnerabilities of varying difficulty levels.

## Features

- **3 Difficulty Levels**: Easy, Medium, and Hard SQL injection challenges
- **Randomized Flags**: Each server restart generates new unique flags
- **Flag Tracking**: Submit found flags and track your progress
- **Clean UI**: Professional interface built with React and Tailwind CSS
- **Local-Only**: Binds to 127.0.0.1 by default for safety

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, SQLite (in-memory database)
- **Database**: SQLite3 (no separate DB server required)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (from project root)
cd ..
npm install
```

### 2. Start the Backend Server

```bash
cd backend
npm start
```

The backend will start on `http://127.0.0.1:3000` and display the generated flags in the console.

### 3. Start the Frontend

In a new terminal:

```bash
npm run dev
```

The frontend will start on `http://localhost:8080`

### 4. Access the Application

Open your browser and navigate to `http://localhost:8080`

## Vulnerabilities Overview

### 🟢 Easy: Reflected SQL Injection

- **Location**: Product search functionality (`/api/search`)
- **Type**: Reflected SQL injection
- **Description**: User input is directly concatenated into a SQL query without sanitization
- **Flag Location**: Stored in a product review's `review_text` field
- **Hint**: Try searching for reviews with special SQL characters

### 🟡 Medium: Boolean-Based Blind SQL Injection

- **Location**: Complaint detail view (`/api/complaints/:id`)
- **Type**: Boolean-based blind SQL injection
- **Description**: The `id` parameter is concatenated directly into SQL, allowing boolean logic exploitation
- **Flag Location**: Stored in `complaints.flag_content` field
- **Hint**: The page behavior differs when a record is found vs not found

### 🔴 Hard: Second-Order SQL Injection

- **Location**: Support ticket system + legacy notes (`/api/support/*`)
- **Type**: Second-order SQL injection
- **Description**: Data submitted via support tickets is later used in an unsafe query against legacy notes
- **Flag Location**: Stored in `legacy_notes.note_content` table
- **Hint**: Submit a support ticket, then search legacy notes

## Flag Management

### Viewing Current Flags

When the backend starts, flags are printed to the console:

```
=================================
🚨 TRAINING LAB INITIALIZED 🚨
=================================

FLAGS (for verification only):
Easy:   FLAG-xxxxxxxxxxxxxxxx
Medium: FLAG-xxxxxxxxxxxxxxxx
Hard:   FLAG-xxxxxxxxxxxxxxxx

⚠️  DO NOT EXPOSE TO INTERNET ⚠️
=================================
```

### Resetting Flags

Flags are automatically randomized each time the backend server restarts.

To manually trigger flag regeneration:

```bash
cd backend
npm run reset-flags
# Then restart the server
npm start
```

### Submitting Flags

Use the "Flag Submission" box on any page to submit found flags. The system will:
- Validate the flag
- Mark it as found
- Display the difficulty level
- Update your progress on the Flag Status page

## Project Structure

```
.
├── backend/
│   ├── server.js           # Main backend with intentional vulnerabilities
│   ├── reset-flags.js      # Flag regeneration utility
│   └── package.json        # Backend dependencies
├── src/
│   ├── components/
│   │   ├── Header.tsx      # Navigation header
│   │   └── FlagSubmission.tsx  # Flag submission widget
│   ├── pages/
│   │   ├── Products.tsx    # Product listing
│   │   ├── ProductDetail.tsx   # Product details with search (EASY)
│   │   ├── Complaints.tsx  # Complaints listing (MEDIUM)
│   │   ├── Support.tsx     # Support tickets (HARD)
│   │   └── FlagStatus.tsx  # Progress tracking
│   └── App.tsx             # Main app router
└── README.md               # This file
```

## Testing the Application

1. **Verify Backend**: Visit `http://127.0.0.1:3000/api/products` - should return JSON product data
2. **Verify Frontend**: Open `http://localhost:8080` - should show the products page
3. **Test Flag Submission**: Submit a flag from the console output to verify the tracking system works
4. **Explore Vulnerabilities**: Try injecting SQL in search fields and URL parameters

## Database Schema

The in-memory SQLite database contains:

- `products` - Tech product catalog
- `reviews` - Customer product reviews (contains EASY flag)
- `complaints` - Customer complaints (contains MEDIUM flag)
- `legacy_notes` - Historical support notes (contains HARD flag)
- `support_tickets` - User-submitted tickets (used for HARD challenge)

All data is reset on server restart.

## Development Notes

- Backend runs on port 3000 (127.0.0.1)
- Frontend runs on port 8080 (localhost)
- CORS is enabled for local development
- Database is in-memory (data lost on restart)
- No external dependencies or API calls at runtime

## Learning Resources

This lab teaches:

- SQL injection fundamentals
- Reflected vs Blind SQL injection
- Second-order SQL injection
- Boolean-based inference techniques
- Parameterized queries (by showing what NOT to do)

## Responsible Disclosure

- Never use SQL injection on systems you don't own
- Always obtain explicit permission before security testing
- This lab is for learning defense techniques, not attack techniques for malicious use

## Troubleshooting

**Backend won't start:**
- Check if port 3000 is already in use
- Ensure Node.js is installed: `node --version`
- Try: `cd backend && npm install`

**Frontend shows "Backend not running":**
- Verify backend is running: `curl http://127.0.0.1:3000/api/products`
- Check backend console for errors

**Can't find flags:**
- Check backend console output for flag values (for verification)
- Read the vulnerability descriptions carefully
- Research SQL injection techniques online

## License

MIT License - For educational use only

## Disclaimer

This software is provided for educational purposes. The authors are not responsible for misuse. Use only on systems you own or have explicit permission to test.

---

**Remember: LOCALHOST ONLY - DO NOT EXPOSE TO INTERNET**
