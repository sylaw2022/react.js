# User Registration with SQLite

## Overview

User registration functionality has been added to the project with SQLite database storage. Hardcoded user accounts have been removed and replaced with database-backed authentication.

---

## What Changed

### New Files Created:
1. **`lib/db.js`** - Database utility functions (connection, schema, CRUD operations)
2. **`lib/auth.js`** - Authentication utilities (password hashing, validation)
3. **`app/api/auth/register/route.js`** - User registration API endpoint

### Updated Files:
1. **`app/api/auth/login/route.js`** - Now uses database instead of hardcoded users
2. **`package.json`** - Added `better-sqlite3` and `bcrypt` dependencies
3. **`.gitignore`** - Added database files to ignore list

---

## Database Schema

### Users Table:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Indexes:
- `idx_username` - Fast username lookups
- `idx_email` - Fast email lookups

---

## API Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",  // Optional
  "password": "securepassword123",
  "role": "user"  // Optional, defaults to "user"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  },
  "expiresIn": "24h"
}
```

**Error Responses:**
- `400` - Validation errors (missing fields, invalid format)
- `409` - Username or email already exists
- `500` - Server error

### 2. Login (Updated)

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  },
  "expiresIn": "24h"
}
```

**Note:** Login now queries the database instead of using hardcoded users.

---

## Validation Rules

### Username:
- Required
- Minimum 3 characters
- Maximum 30 characters
- Only letters, numbers, and underscores allowed

### Email (Optional):
- If provided, must be valid email format
- Must be unique

### Password:
- Required
- Minimum 6 characters
- Maximum 100 characters

---

## Security Features

1. **Password Hashing**: Uses bcrypt with 10 salt rounds
2. **SQL Injection Protection**: Uses parameterized queries
3. **Unique Constraints**: Prevents duplicate usernames/emails
4. **Input Validation**: Validates all user inputs
5. **No Plain Text Passwords**: Passwords are never stored in plain text

---

## Database Location

The SQLite database is stored at:
```
data/users.db
```

The `data/` directory is automatically created on first use.

---

## Usage Examples

### Register a New User:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "mypassword123"
  }'
```

### Login with Registered User:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "mypassword123"
  }'
```

### Register Admin User:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "adminpassword123",
    "role": "admin"
  }'
```

---

## Database Functions

### Available Functions in `lib/db.js`:

- `getDb()` - Get database connection (singleton)
- `getUserByUsername(username)` - Find user by username
- `getUserByEmail(email)` - Find user by email
- `getUserById(id)` - Find user by ID
- `createUser(userData)` - Create new user
- `updateUser(id, updates)` - Update user
- `deleteUser(id)` - Delete user
- `closeDb()` - Close database connection

### Available Functions in `lib/auth.js`:

- `hashPassword(password)` - Hash password with bcrypt
- `comparePassword(password, hash)` - Compare password with hash
- `validateUsername(username)` - Validate username format
- `validateEmail(email)` - Validate email format
- `validatePassword(password)` - Validate password format

---

## Migration from Hardcoded Users

### Before:
```javascript
const validUsers = {
  'admin': { password: 'admin123', userId: 1, role: 'admin' },
  'user': { password: 'user123', userId: 2, role: 'user' },
}
```

### After:
- Users are stored in SQLite database
- Passwords are hashed with bcrypt
- Users can register themselves
- No hardcoded credentials

---

## Next Steps

1. **Create Initial Admin User**: Register an admin user after starting the server
2. **Add Password Reset**: Implement password reset functionality
3. **Add Email Verification**: Verify email addresses on registration
4. **Add User Profile**: Allow users to update their profiles
5. **Add User Management**: Admin panel to manage users

---

## Troubleshooting

### Database Not Created:
- Check that the `data/` directory has write permissions
- Check console logs for database connection errors

### Registration Fails:
- Check validation error messages
- Ensure username/email is unique
- Verify password meets requirements

### Login Fails:
- Verify user exists in database
- Check password is correct
- Check console logs for authentication errors

---

## Summary

✅ **User registration** - Users can now register via API  
✅ **SQLite database** - Persistent user storage  
✅ **Password hashing** - Secure password storage with bcrypt  
✅ **Hardcoded users removed** - All authentication uses database  
✅ **Input validation** - Comprehensive validation rules  
✅ **Security** - SQL injection protection, unique constraints  

Your authentication system is now database-backed and production-ready! 🎉



