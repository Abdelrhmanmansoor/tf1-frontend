# Backend Match System Requirements - TF1 Platform

## Issue
Frontend is sending match creation requests, but the Backend is rejecting them with enum validation errors.

## Current Frontend Match Payload
```json
{
  "name": "Match Name",
  "sport": "football",
  "region": "الرياض",
  "city": "الرياض",
  "neighborhood": "شارع العليا، الملعب",
  "date": "2025-12-07",
  "time": "17:00",
  "level": "amateur",
  "maxPlayers": 10,
  "venue": "ملعب النادي"
}
```

## Required Changes

### 1. Sport Enum Values
**Frontend sends:** `"football"`
**Backend must accept:** `"football"` (not uppercase, not other variations)

### 2. Level Enum Values  
**Frontend sends:** `"amateur"`
**Backend must accept:** `"amateur"` (lowercase)

### Alternative Enum Values (if different from above)
If your Mongoose schema uses different enum values, please provide:
- Valid `sport` enum values (e.g., FOOTBALL, Football, soccer, etc.)
- Valid `level` enum values (e.g., AMATEUR, Amateur, 1, etc.)

## Current Backend Error Messages
```
sport: `football` is not a valid enum value for path `sport`
level: `amateur` is not a valid enum value for path `level`
```

## PublicMatch Schema Update Needed
Update `/src/models/PublicMatch.js` (or similar):

```javascript
// Current (BROKEN):
sport: {
  type: String,
  enum: ['FOOTBALL', 'BASKETBALL', ...],  // ❌ Doesn't accept 'football'
  required: true
},
level: {
  type: String,
  enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],  // ❌ Wrong values
  required: true
}

// Should be (FIXED):
sport: {
  type: String,
  enum: ['football', 'basketball', 'volleyball'],
  required: true
},
level: {
  type: String,
  enum: ['amateur'],  // Frontend currently only sends this
  required: true
}
```

## Action Items
1. ✅ Update Mongoose schema enum values to match Frontend
2. ✅ Test: POST `/api/v1/matches` with provided payload above
3. ✅ Confirm: Match is created successfully (200 response)
4. ✅ Notify: Frontend will retry automatically on next deployment

## Frontend Status
- ✅ Form validation working
- ✅ Data collection complete
- ✅ API endpoint connectivity confirmed
- ⏳ Waiting for: Backend enum validation fix

---
**Contact:** TF1 Frontend Team  
**Date:** December 6, 2025  
**Platform:** tf1one.com
