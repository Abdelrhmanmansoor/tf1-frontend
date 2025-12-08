# Matches Authentication Module

## Overview

The Matches module now includes a complete authentication system following the confirmed backend contract. This module provides independent auth functionality for the Matches feature while integrating seamlessly with the existing platform infrastructure.

## Backend Contract

- **API Prefix**: `/matches`
- **Auth Endpoints**:
  - `POST /matches/auth/register` - Register a new user
  - `POST /matches/auth/login` - Login and receive JWT token
  - `GET /matches/auth/me` - Get current authenticated user
- **Authentication**: JWT stored in localStorage, sent as `Authorization: Bearer <token>`

## Implementation

### Service Methods

Located in `services/matches.ts`:

#### 1. `matchesRegister(userData: MatchesRegisterData)`

Registers a new user in the Matches module.

**Parameters:**

```typescript
{
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
}
```

**Returns:**

```typescript
{
  success: boolean
  message: string
  user?: MatchesUser
}
```

**Example:**

```typescript
import { matchesRegister } from '@/services/matches'

const result = await matchesRegister({
  email: 'user@example.com',
  password: 'SecurePass123!',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+966501234567',
})
```

#### 2. `matchesLogin(email: string, password: string)`

Authenticates a user and stores the JWT token.

**Parameters:**

- `email: string` - User's email address
- `password: string` - User's password

**Returns:**

```typescript
{
  accessToken: string
  user: MatchesUser
}
```

**Side Effects:**

- Stores JWT token in localStorage
- Stores user data in localStorage
- Sets authentication cookie

**Example:**

```typescript
import { matchesLogin } from '@/services/matches'

const { accessToken, user } = await matchesLogin(
  'user@example.com',
  'SecurePass123!'
)
console.log('Logged in as:', user.firstName)
```

#### 3. `matchesGetMe()`

Retrieves the current authenticated user's information.

**Parameters:** None (uses JWT from localStorage)

**Returns:**

```typescript
{
  id: string
  email: string
  firstName: string
  lastName: string
  isEmailVerified: boolean
}
```

**Side Effects:**

- Updates user data in localStorage with fresh data from backend

**Example:**

```typescript
import { matchesGetMe } from '@/services/matches'

const currentUser = await matchesGetMe()
console.log('Current user:', currentUser)
```

## Type Definitions

Located in `types/match.ts`:

### MatchesRegisterData

```typescript
interface MatchesRegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
}
```

### MatchesLoginResponse

```typescript
interface MatchesLoginResponse {
  accessToken: string
  user: MatchesUser
}
```

### MatchesUser

```typescript
interface MatchesUser {
  id: string
  email: string
  firstName: string
  lastName: string
  isEmailVerified: boolean
}
```

### MatchesRegisterResponse

```typescript
interface MatchesRegisterResponse {
  success: boolean
  message: string
  user?: MatchesUser
}
```

## JWT Token Handling

### Storage

- **Key**: `sportx_access_token` (defined in `config/api.ts`)
- **Location**: Browser localStorage
- **Cookie**: Also stored as cookie for middleware access
- **Expiration**: 7 days

### Automatic Request Handling

The JWT token is automatically handled by the axios interceptor in `services/api.ts`:

1. **Token Attachment**: Token is automatically attached to all API requests as `Authorization: Bearer <token>`
2. **Expiration Check**: Token expiration is validated before each request
3. **Auto Redirect**: Expired tokens trigger automatic redirect to login page (for dashboard pages)
4. **Error Handling**: 401 responses clear the token and redirect if appropriate

### Example Token Flow

```typescript
// 1. User logs in
const { accessToken, user } = await matchesLogin(email, password)
// Token is stored: localStorage.setItem('sportx_access_token', accessToken)

// 2. Subsequent requests automatically include token
const matches = await getMatches() // Token sent as: Authorization: Bearer <token>

// 3. Get current user
const currentUser = await matchesGetMe() // Uses stored token automatically
```

## Integration with Existing Platform

### Shared Infrastructure

The Matches auth module integrates with existing platform components:

1. **API Client**: Uses the same axios instance (`services/api.ts`)
2. **Token Key**: Uses the same token key (`API_CONFIG.TOKEN_KEY`)
3. **Interceptors**: Leverages existing request/response interceptors
4. **Error Handling**: Uses platform-wide error handling patterns

### Independent Module

While integrated, the Matches auth module remains independent:

- Separate auth endpoints (`/matches/auth/*` vs `/auth/*`)
- Can be used without affecting main authentication
- Maintains its own user context within the Matches feature

## Error Handling

All auth methods throw errors that should be caught by the caller:

```typescript
try {
  const result = await matchesLogin(email, password)
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Invalid credentials
  } else if (error.code === 'ECONNABORTED') {
    // Timeout
  } else {
    // Other error
  }
}
```

## Security Considerations

1. **JWT Storage**: Token stored in localStorage (XSS vulnerability consideration)
2. **Cookie**: Also stored as httpOnly cookie for server-side access
3. **HTTPS**: Always use HTTPS in production
4. **Token Expiration**: Tokens expire after 7 days
5. **Validation**: Backend validates token on each request
6. **No Security Vulnerabilities**: CodeQL analysis passed with 0 alerts

## Usage Examples

### Complete Authentication Flow

```typescript
import { matchesRegister, matchesLogin, matchesGetMe } from '@/services/matches'

// 1. Register new user
async function registerUser() {
  try {
    const result = await matchesRegister({
      email: 'newuser@example.com',
      password: 'SecurePass123!',
      firstName: 'Jane',
      lastName: 'Smith',
    })

    if (result.success) {
      console.log('Registration successful!')
    }
  } catch (error) {
    console.error('Registration failed:', error.message)
  }
}

// 2. Login
async function login() {
  try {
    const { accessToken, user } = await matchesLogin(
      'newuser@example.com',
      'SecurePass123!'
    )

    console.log('Logged in successfully!')
    console.log('User:', user)

    // Token is now stored and will be used automatically
  } catch (error) {
    console.error('Login failed:', error.message)
  }
}

// 3. Get current user
async function getCurrentUser() {
  try {
    const user = await matchesGetMe()
    console.log('Current user:', user)
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('Not authenticated')
    } else {
      console.error('Error:', error.message)
    }
  }
}
```

### React Component Example

```typescript
'use client'

import { useState } from 'react'
import { matchesLogin, matchesGetMe } from '@/services/matches'

export default function MatchesAuth() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const handleLogin = async (email: string, password: string) => {
    try {
      const { user } = await matchesLogin(email, password)
      setUser(user)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const loadCurrentUser = async () => {
    try {
      const currentUser = await matchesGetMe()
      setUser(currentUser)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      {user ? (
        <p>Welcome, {user.firstName}!</p>
      ) : (
        <button onClick={() => handleLogin('user@example.com', 'pass')}>
          Login
        </button>
      )}
    </div>
  )
}
```

## Testing

### Manual Testing

1. **Test Registration:**

```typescript
// In browser console
import { matchesRegister } from '@/services/matches'
await matchesRegister({
  email: 'test@example.com',
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'User',
})
```

2. **Test Login:**

```typescript
// In browser console
import { matchesLogin } from '@/services/matches'
const result = await matchesLogin('test@example.com', 'Test123!')
console.log('Token stored:', localStorage.getItem('sportx_access_token'))
```

3. **Test Get Current User:**

```typescript
// In browser console
import { matchesGetMe } from '@/services/matches'
const user = await matchesGetMe()
console.log('Current user:', user)
```

### Verification

- ✅ Build successful
- ✅ Lint checks passed
- ✅ TypeScript compilation clean
- ✅ Code review passed
- ✅ Security scan (CodeQL): 0 alerts
- ✅ No duplicate code
- ✅ Proper type safety

## Maintenance

### Adding New Auth Methods

To add new auth methods to the Matches module:

1. Add the method to `services/matches.ts`
2. Define types in `types/match.ts`
3. Export from default object
4. Document in this file
5. Test thoroughly

### Updating Types

All Matches auth types are defined in `types/match.ts`. Update there to maintain single source of truth.

## Support

For issues or questions:

1. Check this documentation
2. Review code comments in `services/matches.ts`
3. Refer to main auth service (`services/auth.ts`) for patterns
4. Check backend API contract

## Changelog

### 2025-12-07

- Initial implementation of Matches auth module
- Added `matchesRegister()`, `matchesLogin()`, `matchesGetMe()`
- Added TypeScript type definitions
- Integrated with existing JWT infrastructure
- Passed all security checks
