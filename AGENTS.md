# Project Guidelines

## Project Goal

Build a RESTful blog API for Grad Careers using **Node.js**, **Express.js**, **MongoDB Atlas**, and **Mongoose**.

## Required Features

- Implement CRUD routes for blog posts.
- Store the authenticated user as the post's `author`, which is also its owner; do not maintain a separate author resource or duplicate creator field.
- Require post title, content, and at least one existing category.
- Support user registration and login with JWT authentication.
- Protect content creation and allow only the post creator to update or delete that post.
- Return JSON responses and validate incoming data.
- Handle errors consistently, including invalid input, missing resources, and unauthorized access.
- Enable CORS for frontend integration and test endpoints with Postman.

## Implementation Guidelines

- Organize the application into clear route, controller, model, and middleware modules.
- Support Node.js 16.20.1 or later.
- Load configuration from environment variables; never hardcode or commit credentials or JWT secrets.
- Hash passwords before storing them and verify them during login.
- Use REST conventions and the endpoints documented in `README.md`; posts derive their author from the authenticated user.
- Run the automated tests with `npm test`.
- Keep the README's setup instructions and route documentation in sync with the implementation.
- When deploying, use MongoDB Atlas and verify the current limits and configuration requirements of the selected API host.
