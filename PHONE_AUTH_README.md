# Phone Authentication API Documentation

## Overview

This API now supports comprehensive phone-based authentication using Indian mobile numbers with OTP (One-Time Password) verification via Twilio SMS service. The phone authentication system is fully integrated with the existing JWT token-based authentication.

## Features

### ✅ Completed Features

1. **ES6 Module Conversion** - Entire codebase converted from CommonJS to ES6 modules
2. **Indian Phone Number Validation** - Supports Indian mobile numbers with validation
3. **Twilio SMS Integration** - OTP delivery via Twilio SMS service
4. **Database OTP Storage** - Secure OTP storage with TTL (Time To Live) expiry
5. **JWT Token Generation** - Complete authentication flow with access and refresh tokens
6. **Comprehensive Testing** - Test scripts for all phone authentication APIs
7. **Swagger Documentation** - Complete API documentation for all endpoints

## API Endpoints

### 1. Send Mobile OTP
**Endpoint:** `POST /v1/auth/send-mobile-otp`

**Description:** Sends a 4-digit OTP to the provided Indian mobile phone number.

**Request Body:**
```json
{
  "phone": "+919876543210"
}
```

**Phone Number Format:**
- Indian mobile numbers only
- Can include country code: `+91` or `91` (optional)
- Must start with digits 6-9
- Total 10 digits after country code
- Examples: `+919876543210`, `919876543210`, `9876543210`

**Response (Success):**
```json
{
  "message": "OTP sent successfully",
  "phoneNumber": "+919876543210",
  "sid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Response (Error):**
```json
{
  "code": 400,
  "message": "phone must be a valid Indian phone number"
}
```

### 2. Verify Mobile OTP
**Endpoint:** `POST /v1/auth/verify-mobile-otp`

**Description:** Verifies the OTP and creates/logs in user with JWT tokens.

**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "1234",
  "purpose": "phone_verification"
}
```

**Parameters:**
- `phone`: Indian mobile number (same format as above)
- `otp`: 4-digit OTP received via SMS
- `purpose`: Either `phone_verification` or `login`

**Response (Success - New User):**
```json
{
  "message": "OTP verified successfully",
  "phoneNumber": "+919876543210",
  "verified": true,
  "user": {
    "id": "user_id_here",
    "phoneNumber": "+919876543210",
    "isPhoneVerified": true,
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "access": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2024-01-01T01:00:00.000Z"
    },
    "refresh": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2024-01-30T00:00:00.000Z"
    }
  }
}
```

**Response (Error):**
```json
{
  "message": "Invalid or expired OTP",
  "phoneNumber": "+919876543210",
  "verified": false
}
```

### 3. Phone Login
**Endpoint:** `POST /v1/auth/phone-login`

**Description:** Sends login OTP to verified phone number for authentication.

**Request Body:**
```json
{
  "phone": "+919876543210"
}
```

**Response (Success):**
```json
{
  "message": "Login OTP sent successfully",
  "phoneNumber": "+919876543210",
  "sid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Response (Error - Phone Not Verified):**
```json
{
  "code": 400,
  "message": "Phone number not verified. Please verify your phone number first."
}
```

**Response (Error - Account Not Found):**
```json
{
  "code": 404,
  "message": "No account found with this phone number"
}
```

## Authentication Flow

### New User Registration Flow
1. **Send OTP:** `POST /v1/auth/send-mobile-otp` with phone number
2. **Verify OTP:** `POST /v1/auth/verify-mobile-otp` with phone, OTP, and purpose `phone_verification`
3. **Get Tokens:** User is created automatically and JWT tokens are returned
4. **Use Tokens:** Use the access token for authenticated requests

### Existing User Login Flow
1. **Request Login OTP:** `POST /v1/auth/phone-login` with phone number
2. **Verify Login OTP:** `POST /v1/auth/verify-mobile-otp` with phone, OTP, and purpose `login`
3. **Get Tokens:** JWT tokens are returned for the existing user
4. **Use Tokens:** Use the access token for authenticated requests

## Database Schema

### User Model Updates
```javascript
{
  name: String,
  email: String (optional),
  password: String (optional),
  phoneNumber: String (unique, indexed),
  isPhoneVerified: Boolean (default: false),
  isEmailVerified: Boolean (default: false),
  role: String (default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Model
```javascript
{
  phone: String (required, indexed),
  otp: String (required),
  purpose: String (enum: ['phone_verification', 'login']),
  attempts: Number (default: 0, max: 3),
  createdAt: Date (TTL: 10 minutes),
  updatedAt: Date
}
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test tests/integration/auth.test.js

# Run with coverage
npm run coverage
```

### Test Coverage
- ✅ Send Mobile OTP API tests
- ✅ Verify Mobile OTP API tests  
- ✅ Phone Login API tests
- ✅ Validation error handling
- ✅ SMS service error handling
- ✅ User creation and login flows

## Environment Variables

Ensure these environment variables are set:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# JWT Configuration  
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION_MINUTES=15
JWT_REFRESH_EXPIRATION_DAYS=30

# MongoDB Configuration
MONGODB_URL=your_mongodb_connection_string

# Node Environment
NODE_ENV=development
PORT=3000
```

## Security Features

1. **OTP Expiry:** OTPs expire after 10 minutes using MongoDB TTL
2. **Attempt Limiting:** Maximum 3 OTP verification attempts per OTP
3. **Phone Validation:** Strict Indian phone number format validation
4. **JWT Security:** Secure token generation with expiry times
5. **Rate Limiting:** Built-in rate limiting for API endpoints
6. **Input Sanitization:** XSS protection and input validation

## Swagger Documentation

Complete API documentation is available at:
- **Development:** `http://localhost:3000/v1/docs`
- **Production:** `https://your-domain.com/v1/docs`

The Swagger documentation includes:
- Complete request/response schemas
- Example requests and responses
- Error code documentation
- Authentication requirements

## Error Handling

The API returns standardized error responses:

```json
{
  "code": 400,
  "message": "Descriptive error message",
  "stack": "Error stack (development only)"
}
```

Common error codes:
- `400`: Bad Request (validation errors, invalid OTP)
- `404`: Not Found (phone number not registered)
- `500`: Internal Server Error (SMS service errors, database errors)

## Development Notes

### ES6 Module Conversion
- All files converted from CommonJS (`require`/`module.exports`) to ES6 (`import`/`export`)
- `package.json` updated with `"type": "module"`
- Jest configuration updated for ES6 module support

### Twilio Integration
- Twilio Verify API used for OTP delivery
- Trial account limitations apply (verified numbers only)
- Production deployment requires full Twilio account

### Database Optimization
- Phone number field indexed for fast lookups
- TTL index on OTP collection for automatic cleanup
- Mongoose plugins for pagination and JSON transformation

## Future Enhancements

### Potential Improvements
1. **Multi-country Support:** Extend beyond Indian phone numbers
2. **Voice OTP:** Add voice call OTP delivery option
3. **WhatsApp Integration:** OTP delivery via WhatsApp Business API
4. **Fraud Detection:** Enhanced security with device fingerprinting
5. **Analytics Dashboard:** OTP delivery and verification metrics

### Monitoring
- Monitor OTP delivery success rates
- Track authentication conversion rates
- Alert on unusual verification patterns
- Log security events for audit trails

---

## Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Environment Variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Test Phone Authentication:**
   ```bash
   # Send OTP
   curl -X POST http://localhost:3000/v1/auth/send-mobile-otp \
     -H "Content-Type: application/json" \
     -d '{"phone":"+919876543210"}'
   
   # Verify OTP (replace with actual OTP)
   curl -X POST http://localhost:3000/v1/auth/verify-mobile-otp \
     -H "Content-Type: application/json" \
     -d '{"phone":"+919876543210","otp":"1234","purpose":"phone_verification"}'
   ```

5. **Access API Documentation:**
   ```
   http://localhost:3000/v1/docs
   ```

The phone authentication system is now fully functional and ready for production use! 🚀