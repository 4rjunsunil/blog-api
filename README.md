# Grad Careers Blog API

A RESTful backend API for the Grad Careers blogging platform, built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **Mongoose**.

## Features

- CRUD operations for blog posts
- Posts are authored by their logged-in creator and linked to one or more categories
- User registration and login with JWT authentication
- Password hashing, request validation, and consistent JSON errors
- CORS support for frontend integration
- Postman endpoint testing

## Prerequisites

- Node.js 16.20.1 or later and npm
- A MongoDB Atlas account and database
- Postman (recommended for manual endpoint testing)

MongoDB Atlas offers a free cluster for small development projects. It has usage and feature limits; check the current [Atlas free-cluster documentation](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/).

## Setup

Install dependencies:

```bash
npm install
```

### Local MongoDB with Docker Desktop

The project can use a local MongoDB container instead of Atlas. Create and start a dedicated MongoDB 7 container with a persistent Docker volume:

```bash
docker run --name grad-careers-mongodb --publish 127.0.0.1:27019:27017 --volume grad-careers-mongodb-data:/data/db --detach mongo:7
```

The database is available at `mongodb://127.0.0.1:27019/grad_careers_blog`. The port is bound to localhost, and the named volume keeps data when the container is stopped or recreated. To stop and start the container later:

```bash
docker stop grad-careers-mongodb
docker start grad-careers-mongodb
```

If the container already exists, do not run the creation command again; use `docker start grad-careers-mongodb`.

### Environment variables

Copy `.env.example` to `.env`. The example connection string points to the local Docker database; use your Atlas connection string instead when connecting to Atlas.

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27019/grad_careers_blog
JWT_SECRET=replace_with_a_random_secret_at_least_32_characters_long
```

For Atlas, create a database user and configure network access so the API host can connect. The server requires a JWT secret of at least 32 characters. Keep `.env` out of version control and never commit credentials or secrets.

Start the development server:

```bash
npm run dev
```

Start normally with `npm start`. The local base URL is `http://localhost:3000`; check service status at `GET /api/health`.

## API Routes

All routes are prefixed with `/api`. Protected routes require a valid JWT in the `Authorization` header using HTTP bearer-token authentication. Both registration and login return a token.

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a user and receive a JWT | No |
| `POST` | `/api/auth/login` | Log in and receive a JWT | No |
| `GET` | `/api/posts` | List blog posts | No |
| `GET` | `/api/posts/:id` | Get a post by ID | No |
| `POST` | `/api/posts` | Create a post | Yes |
| `PUT` | `/api/posts/:id` | Update a post | Yes |
| `DELETE` | `/api/posts/:id` | Delete a post | Yes |
| `GET` | `/api/categories` | List categories | No |
| `POST` | `/api/categories` | Create a category | Yes |

### Resource fields and access

- Registration requires `name`, `email`, and `password`; passwords must have at least 8 characters.
- Categories require `name` and may include a `description`.
- Posts require `title`, `content`, and at least one existing category ID in `categories`. The server assigns the authenticated user as the post's author; do not send an `author` field.
- The post's author is also its owner. Only that user can update or delete it. `PUT` requires all post fields.

Example post body:

```json
{
  "title": "Starting a Career in Tech",
  "content": "A practical guide for new graduates.",
  "categories": ["507f1f77bcf86cd799439012"]
}
```

Post responses include the author's public `name` and ID. The author's email and password are not exposed.

### Existing database data

This version removes the separate Author resource and changes post ownership to the `author` user reference. The previous local development database was cleared for this change. Before using a different database containing data from the previous schema, back it up and migrate each post's `author` to its existing `createdBy` user ID, then remove `createdBy` and the old authors collection. Alternatively, configure a new empty database.

Invalid input returns `400`, missing resources return `404`, unauthenticated requests return `401`, and non-owner write attempts return `403`. Errors use a JSON object with an `error` field.

## Project Structure

```text
project/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── test/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Testing

Run automated input-validation tests:

```bash
npm test
```

Use Postman for end-to-end testing of successful requests, validation errors, missing resources, and protected routes. Database-backed routes require a reachable MongoDB Atlas database.

## Deployment

The API can be deployed to Render or Railway and connected to MongoDB Atlas. Set `MONGODB_URI` and `JWT_SECRET` as environment variables in the hosting service and allow the deployed API to connect through Atlas network access settings. Check the hosting provider's current plans and limits; API hosting may not be free.
