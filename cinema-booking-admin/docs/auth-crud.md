# Auth Module CRUD Operations

This document contains all the CRUD operations available in the Auth module and how to test them using curl commands.

## Prerequisites
- The API server must be running on `http://localhost:3000`
- You'll need `curl` installed on your system
- Store the JWT token received from login for subsequent requests

## 1. Register (Create)
Creates a new user account.

```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "phone": "1234567890",
  "role": "user"
}'
```

Expected Response:
```json
{
  "id": "uuid",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "createdAt": "timestamp"
}
```

## 2. Login (Read)
Authenticates a user and returns a JWT token.

```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "test123"
}'
```

Expected Response:
```json
{
  "access_token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Test User",
    "role": "user"
  }
}
```

## 3. Get Profile (Read)
Retrieves the current user's profile.

```bash
curl -X GET http://localhost:3000/api/auth/profile \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected Response:
```json
{
  "id": "uuid",
  "email": "test@example.com",
  "name": "Test User",
  "phone": "1234567890",
  "role": "user",
  "preferences": {},
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 4. Update Profile (Update)
Updates the current user's profile information.

```bash
curl -X PUT http://localhost:3000/api/auth/profile \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "name": "Updated Name",
  "phone": "0987654321"
}'
```

Expected Response:
```json
{
  "id": "uuid",
  "name": "Updated Name",
  "email": "test@example.com",
  "phone": "0987654321",
  "updatedAt": "timestamp"
}
```

## 5. Change Password (Update)
Updates the user's password.

```bash
curl -X PUT http://localhost:3000/api/auth/change-password \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "currentPassword": "test123",
  "newPassword": "newtest123"
}'
```

Expected Response:
```json
{
  "message": "Password updated successfully"
}
```

## 6. Logout (Delete Session)
Invalidates the current JWT token.

```bash
curl -X POST http://localhost:3000/api/auth/logout \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected Response:
```json
{
  "message": "Logged out successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["validation error messages"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

## Testing Sequence

1. First, register a new user
2. Login with the registered user
3. Copy the JWT token from the login response
4. Use the token to test other endpoints
5. Update profile or change password
6. Finally, test the logout endpoint

## Notes

- All requests (except register and login) require a valid JWT token
- The token must be included in the Authorization header as "Bearer YOUR_JWT_TOKEN"
- Passwords must be at least 6 characters long
- Email must be unique in the system
- Role can be either "user" or "admin" 