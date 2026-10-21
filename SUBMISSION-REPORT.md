# Grad Careers Blog API — Project Report

## 1. API Purpose and Overview

The Grad Careers Blog API provides JSON endpoints for registering and authenticating users, publishing blog posts, and organizing posts into categories. It is implemented with Express.js and stores data in MongoDB through Mongoose. It can connect to the local MongoDB Docker container for development or to MongoDB Atlas when configured for deployment.

Each post's author is the authenticated user who created it. The same user reference establishes ownership, so only the post's author can update or delete that post. Posts must have a title, content, and at least one existing category.

Passwords are hashed before storage. Protected routes use JWT bearer-token authentication. Incoming data is validated, and errors are returned as JSON.

## 2. Endpoint Documentation

All endpoints use the `/api` prefix. Protected endpoints require the token returned by registration or login, included in the request's `Authorization` header.

| Method | Endpoint | Access | Success response |
|---|---|---|---|
| `GET` | `/api/health` | Public | `200 OK`, API status |
| `POST` | `/api/auth/register` | Public | `201 Created`, user and JWT |
| `POST` | `/api/auth/login` | Public | `200 OK`, user and JWT |
| `GET` | `/api/posts` | Public | `200 OK`, list of posts |
| `GET` | `/api/posts/:id` | Public | `200 OK`, one post |
| `POST` | `/api/posts` | Authenticated | `201 Created`, new post |
| `PUT` | `/api/posts/:id` | Post author | `200 OK`, updated post |
| `DELETE` | `/api/posts/:id` | Post author | `204 No Content` |
| `GET` | `/api/categories` | Public | `200 OK`, list of categories |
| `POST` | `/api/categories` | Authenticated | `201 Created`, new category |

### Status and error behavior

- `400 Bad Request` — invalid input, invalid IDs, or references to categories that do not exist.
- `401 Unauthorized` — missing, invalid, or expired authentication token, or invalid login credentials.
- `403 Forbidden` — a logged-in user attempts to update or delete another user's post.
- `404 Not Found` — unknown route or requested post does not exist.
- `409 Conflict` — duplicate value such as an already registered email or category name.
- `500 Internal Server Error` — unexpected server-side failure.

Error responses have this shape:

```json
{
  "error": "A human-readable explanation"
}
```

## 3. Example JSON Requests and Responses

The IDs below are illustrative. In Postman, use the actual category ID returned by your API. Authentication tokens are intentionally omitted; use the token returned from your own registration or login request.

### Register a user

**Request — `POST /api/auth/register`**

```json
{
  "name": "Postman Tester",
  "email": "postman-tester@example.com",
  "password": "my-test-password-123"
}
```

**Example response — `201 Created`**

```json
{
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Postman Tester",
      "email": "postman-tester@example.com"
    },
    "token": "<JWT returned by the API>"
  }
}
```

### Create a category

Send an authenticated **`POST /api/categories`** request:

```json
{
  "name": "Career Advice",
  "description": "Guidance for starting a career"
}
```

**Example response — `201 Created`**

```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Career Advice",
    "description": "Guidance for starting a career"
  }
}
```

### Create a post

Send an authenticated **`POST /api/posts`** request. The author is taken from the token; do not include an `author` field.

```json
{
  "title": "Starting a Career in Tech",
  "content": "A practical guide for new graduates.",
  "categories": ["507f1f77bcf86cd799439012"]
}
```

**Example response — `201 Created`**

```json
{
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Starting a Career in Tech",
    "content": "A practical guide for new graduates.",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Postman Tester"
    },
    "categories": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Career Advice",
        "description": "Guidance for starting a career"
      }
    ]
  }
}
```

The API response includes generated timestamps and may include additional Mongoose metadata; those fields are omitted here for readability.

### List posts

**Request — `GET /api/posts`**

**Example response — `200 OK`**

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Starting a Career in Tech",
      "content": "A practical guide for new graduates.",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Postman Tester"
      },
      "categories": [
        {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Career Advice",
          "description": "Guidance for starting a career"
        }
      ]
    }
  ]
}
```

### Update and delete a post

To update, send **`PUT /api/posts/507f1f77bcf86cd799439013`** with the same required post fields as creation and the post author's JWT in the `Authorization` header. The response is `200 OK` with the updated post.

To delete, send **`DELETE /api/posts/507f1f77bcf86cd799439013`** with the author's token. The response is `204 No Content` and has no response body. A different user's token receives `403 Forbidden`.

## 4. Postman Screenshots

**Add genuine screenshots from your Postman session before emailing this report.** The examples above document expected request and response shapes, but are not screenshots or captured runtime responses.

Recommended screenshots:

1. `POST /api/auth/register` showing the request and successful `201` response. Do not expose the returned JWT; redact it or capture only the user object.
2. `POST /api/categories` showing an authenticated request and `201` response.
3. `POST /api/posts` showing the request body without an `author` field and the response with the authenticated user populated as author.
4. `GET /api/posts` showing the post and populated category.
5. An update/delete attempt made by a different user showing `403 Forbidden`.

Before taking screenshots, start the local MongoDB container and API as described in the project README. Use test accounts and redact tokens, passwords, and any personal information.

## 5. GitHub Repository

The source code and project README are available at:

[https://github.com/4rjunsunil/blog-api](https://github.com/4rjunsunil/blog-api)

## 6. Reflection

Building this API helped me understand how backend routes, controllers, middleware, models, and a database work together. I learned how REST methods represent create, read, update, and delete operations, and how Mongoose references connect posts to users and categories without duplicating their details.

I also learned that authentication and authorization solve different problems: a JWT authenticates a request, while checking the post's author determines whether that user is allowed to change or delete it. Password hashing, input validation, environment-based configuration, and consistent error responses are important for handling user data responsibly.




