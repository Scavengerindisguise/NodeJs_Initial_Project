# Node.js Authentication & Authorization API

This project is a Node.js + Express backend built to demonstrate secure authentication and role-based authorization in a practical web API. It includes user registration, login, JWT access tokens, refresh token rotation, protected routes, and employee management endpoints.

## What this project does

The app is designed as a small REST API with a real authentication flow:

- Users can register a new account.
- Users can log in with a username and password.
- Passwords are hashed using bcrypt before being stored.
- The server generates an access token and a refresh token on login.
- The refresh token is stored in an HTTP-only cookie.
- Protected routes require a valid JWT in the Authorization header.
- Role-based access control restricts actions such as creating, editing, or deleting employee records.
- Failed requests are logged and central error handling is used.

## Main technologies used

- Node.js
- Express.js
- JWT (jsonwebtoken)
- bcrypt
- cookie-parser
- CORS
- dotenv
- custom middleware and logging

## Project structure

- `server.js` — starts the Express app and sets up middleware and routes.
- `routes/` — defines public and protected API routes.
- `controllers/` — handles login, registration, logout, refresh token, and employee logic.
- `middleware/` — contains JWT verification, role checks, CORS credentials handling, and request logging.
- `config/` — stores CORS settings and role definitions.
- `model/users.json` — stores user accounts and refresh token data.
- `public/` — static frontend assets.
- `views/` — HTML pages served by the app.

## Authentication flow

### 1. Register a user

A POST request to `/register` creates a new account.

- Request body example:

  ```json
  {
    "user": "newuser",
    "pwd": "mypassword"
  }
  ```

- The password is hashed and saved in `model/users.json`.

### 2. Log in

A POST request to `/auth` checks the username and password.

- If valid, the server creates:
  - an access token with a short expiration time
  - a refresh token with a longer expiration time
- The refresh token is stored as an HTTP-only cookie.
- The response returns the access token to the client.

### 3. Access protected routes

Protected endpoints under `/employees` require a valid access token.

Example header:

```http
Authorization: Bearer <access_token>
```

If the token is missing or invalid, the server responds with `401` or `403`.

### 4. Refresh token flow

A request to `/refresh` checks the refresh token from the cookie.

- If valid, the server issues a new access token.
- This allows the user to stay authenticated without re-entering credentials.

### 5. Logout

A request to `/logout` clears the refresh token from the database and removes it from the cookie.

## Role-based authorization

The app uses roles such as:

- `User`
- `Editor`
- `Admin`

These are defined in `config/roles_list.js` and enforced through `middleware/verifyRoles.js`.

Example behavior:

- `User` may access basic read operations.
- `Editor` may perform updates.
- `Admin` may delete records or manage higher privileges.

## Employee routes

The protected employee API is mounted at `/employees` and supports:

- `GET /employees` — fetch all employees
- `GET /employees/:id` — fetch one employee
- `POST /employees` — create a new employee
- `PUT /employees` — update an employee
- `DELETE /employees` — delete an employee

Those routes are protected by JWT validation and role checks.

## Environment variables

This project uses a `.env` file for secrets. Example:

```env
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
PORT=3500
```

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with the required secrets.

3. Start the server in development mode:

   ```bash
   npm run dev
   ```

4. Or start it normally:
   ```bash
   npm start
   ```

The app runs on the default port `3500` unless set otherwise.

## Notes

This project is a learning-focused backend example, especially useful for understanding:

- JWT authentication
- refresh token patterns
- cookie-based session management
- Express middleware structure
- secure API design with authorization rules

It is a practical foundation for building more complete authentication systems in Node.js applications.
