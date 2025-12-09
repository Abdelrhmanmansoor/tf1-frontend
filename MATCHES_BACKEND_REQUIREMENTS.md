# Matches System - Backend Requirements

## Overview
This document outlines the backend requirements for the isolated Matches system in the TF1 platform.

## Database Schema

### matches_users Table
```sql
CREATE TABLE matches_users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- hashed with bcrypt
  role VARCHAR(50) DEFAULT 'MatchUser',
  is_email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### matches Table
```sql
CREATE TABLE matches (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  sport VARCHAR(50) NOT NULL, -- 'football', 'basketball', etc.
  city VARCHAR(255) NOT NULL,
  area VARCHAR(255) NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  level VARCHAR(50) NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  max_players INT NOT NULL,
  current_players INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'full', 'finished'
  notes TEXT,
  creator_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES matches_users(id)
);
```

### match_participants Table
```sql
CREATE TABLE match_participants (
  id VARCHAR(255) PRIMARY KEY,
  match_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES matches_users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_participation (match_id, user_id)
);
```

## Authentication Endpoints

### POST /matches/api/register
**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Registration successful. Verification code sent to email.",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "MatchUser",
    "is_email_verified": false
  }
}
```

**Actions:**
1. Validate input (name, email, password format)
2. Check if email already exists
3. Hash password with bcrypt
4. Create user in `matches_users` table
5. Generate 6-digit verification code
6. Send verification email using existing email service
7. Store verification code temporarily (Redis or DB)
8. Return user data (without password)

### POST /matches/api/verify
**Request Body:**
```json
{
  "email": "string",
  "code": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Actions:**
1. Validate code against stored code for email
2. Check code expiration (e.g., 15 minutes)
3. Update `is_email_verified = true` in `matches_users`
4. Delete verification code from storage

### POST /matches/api/login
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "JWT_TOKEN",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "MatchUser",
    "is_email_verified": true
  }
}
```

**Response Headers:**
```
Set-Cookie: matches_token=JWT_TOKEN; HttpOnly; Secure; Path=/; Max-Age=604800; SameSite=Strict
```

**Actions:**
1. Validate email and password
2. Check if user exists in `matches_users`
3. Verify password with bcrypt
4. Check if `is_email_verified = true`
5. Generate JWT token with matches-specific secret
6. Set `matches_token` as httpOnly cookie
7. Return user data and accessToken

**JWT Payload:**
```json
{
  "userId": "string",
  "email": "string",
  "role": "MatchUser",
  "type": "matches",
  "exp": 1234567890
}
```

### GET /matches/api/me
**Headers:**
```
Cookie: matches_token=JWT_TOKEN
```

**Response (200):**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "MatchUser",
    "is_email_verified": true
  }
}
```

**Actions:**
1. Verify `matches_token` cookie exists
2. Decode and validate JWT token
3. Check token expiration
4. Fetch user from `matches_users` table
5. Return user data (without password)

## Matches CRUD Endpoints

### GET /matches/api/matches
**Query Parameters:**
- `sport` (optional): Filter by sport
- `city` (optional): Filter by city
- `date` (optional): Filter by date
- `level` (optional): Filter by level
- `page` (optional, default=1): Page number
- `limit` (optional, default=10): Items per page

**Response (200):**
```json
{
  "success": true,
  "matches": [
    {
      "id": "string",
      "title": "string",
      "sport": "string",
      "city": "string",
      "area": "string",
      "location": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "level": "string",
      "max_players": number,
      "current_players": number,
      "status": "string",
      "notes": "string",
      "creator": {
        "id": "string",
        "name": "string"
      }
    }
  ],
  "total": number,
  "page": number,
  "pages": number
}
```

### POST /matches/api/matches
**Headers:**
```
Cookie: matches_token=JWT_TOKEN
```

**Request Body:**
```json
{
  "name": "string",
  "sport": "string",
  "region": "string",
  "city": "string",
  "neighborhood": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "level": "string",
  "maxPlayers": number,
  "venue": "string"
}
```

**Response (201):**
```json
{
  "success": true,
  "match": {
    "id": "string",
    "title": "string",
    "sport": "string",
    "city": "string",
    "area": "string",
    "location": "string",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "level": "string",
    "max_players": number,
    "current_players": 0,
    "status": "open",
    "creator_id": "string"
  }
}
```

### GET /matches/api/matches/:id
**Response (200):**
```json
{
  "success": true,
  "match": {
    "id": "string",
    "title": "string",
    "sport": "string",
    "city": "string",
    "area": "string",
    "location": "string",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "level": "string",
    "max_players": number,
    "current_players": number,
    "status": "string",
    "notes": "string",
    "creator": {
      "id": "string",
      "name": "string"
    },
    "participants": [
      {
        "id": "string",
        "name": "string"
      }
    ]
  }
}
```

### POST /matches/api/matches/:id/join
**Headers:**
```
Cookie: matches_token=JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Successfully joined the match"
}
```

**Actions:**
1. Verify authentication
2. Check if match exists and is open
3. Check if match is not full
4. Check if user hasn't already joined
5. Add entry to `match_participants` table
6. Increment `current_players` count
7. Update match status to 'full' if max_players reached

### POST /matches/api/matches/:id/leave
**Headers:**
```
Cookie: matches_token=JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Successfully left the match"
}
```

**Actions:**
1. Verify authentication
2. Check if user is participant
3. Remove entry from `match_participants` table
4. Decrement `current_players` count
5. Update match status to 'open' if was 'full'

### GET /matches/api/my-matches
**Headers:**
```
Cookie: matches_token=JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "matches": [
    {
      "id": "string",
      "title": "string",
      "sport": "string",
      "city": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "status": "string",
      "current_players": number,
      "max_players": number
    }
  ],
  "total": number
}
```

**Actions:**
1. Verify authentication
2. Fetch all matches where user is in `match_participants`
3. Return matches with relevant details

## Middleware

### matchesAuth Middleware
```javascript
const matchesAuth = (req, res, next) => {
  try {
    // Get matches_token from cookies
    const token = req.cookies.matches_token
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }
    
    // Verify JWT with matches-specific secret
    const decoded = jwt.verify(token, process.env.MATCHES_JWT_SECRET)
    
    // Check token type
    if (decoded.type !== 'matches') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      })
    }
    
    // Attach user to request
    req.matchesUser = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}
```

## Email Verification Service

**Reuse existing email verification service with:**
1. Separate verification codes table/storage for matches users
2. Same email template structure but with matches branding
3. Same code generation and validation logic
4. Same expiration rules (e.g., 15 minutes)

## Environment Variables

```env
# Matches JWT
MATCHES_JWT_SECRET=your_matches_jwt_secret_here
MATCHES_JWT_EXPIRES_IN=7d

# Email Service (reuse existing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds >= 10
2. **JWT Secret**: Use different secret from main site JWT
3. **Cookie Security**: 
   - HttpOnly: true (prevents XSS)
   - Secure: true (HTTPS only in production)
   - SameSite: 'Strict' (prevents CSRF)
4. **Email Verification**: Required before login
5. **Rate Limiting**: Implement on auth endpoints
6. **Input Validation**: Validate all inputs on server side
7. **SQL Injection**: Use parameterized queries
8. **CORS**: Configure properly for frontend domain

## Testing Checklist

- [ ] User can register with name, email, password
- [ ] Verification code is sent to email
- [ ] User can verify email with code
- [ ] User cannot login without email verification
- [ ] User can login with verified email
- [ ] `matches_token` cookie is set on login
- [ ] Protected routes check `matches_token`
- [ ] User can create a match
- [ ] User can join an open match
- [ ] User cannot join a full match
- [ ] User can leave a match
- [ ] User can view their matches
- [ ] Matches list supports filtering
- [ ] Token expires after configured time
- [ ] Invalid/expired tokens return 401

## Notes

- All dates should be stored in UTC
- All responses should include proper HTTP status codes
- All errors should return consistent error format
- Log all authentication attempts for security monitoring
- Consider adding rate limiting to prevent abuse
