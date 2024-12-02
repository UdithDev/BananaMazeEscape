# Game Server API Documentation

Base URL: `http://localhost:3000`

## Authentication Endpoints

### Register Player

- **URL**: `/auth/register`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "username": "string",
  "password": "string"
}
```

- **Success Response (201)**:

```json
{
  "message": "Registration successful"
}
```

- **Error Response (400)**:

```json
{
  "error": "Username already exists"
}
```

### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "username": "string",
  "password": "string"
}
```

- **Success Response (200)**:

```json
{
  "token": "JWT_TOKEN_STRING"
}
```

- **Error Response (400)**:

```json
{
  "error": "Player not found"
}
```

or

```json
{
  "error": "Invalid password"
}
```

## Leaderboard Endpoints

### Update Score

- **URL**: `/leaderboard/score`
- **Method**: `POST`
- **Authentication**: Required (Bearer Token)
- **Content-Type**: `application/json`
- **Headers**:

```
Authorization: Bearer <JWT_TOKEN>
```

- **Body**:

```json
{
    "score": number
}
```

- **Success Response (200)**:

```json
{
  "message": "Score updated"
}
```

- **Error Response (401)**:

```json
{
  "error": "Access denied"
}
```

### Get Leaderboard

- **URL**: `/leaderboard`
- **Method**: `GET`
- **Authentication**: Not Required
- **Success Response (200)**:

```json
[
    {
        "username": "string",
        "score": number,
        "lastPlayed": "ISO_DATE_STRING"
    }
]
```

## Error Responses

All endpoints may return these error responses:

### Server Error (500)

```json
{
  "error": "Error message description"
}
```

### Authentication Error (403)

```json
{
  "error": "Invalid token"
}
```

## Rate Limiting

- None implemented currently

## Notes

- All timestamps are in ISO 8601 format
- Leaderboard returns top 10 players sorted by score
- JWT tokens expire after 24 hours
- Passwords are hashed using bcrypt with salt rounds of 10
