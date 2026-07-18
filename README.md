# Asset Tracker API

A NestJS REST API for user authentication and personal asset tracking. Users can register, sign in with JWT tokens, create assets, record valuations, and view portfolio summaries and performance.

## Features

- Email/password registration and JWT login.
- Protected per-user asset CRUD operations.
- Asset valuations, portfolio summary, and performance calculations.
- SQLite database using TypeORM.
- Scalar API reference at `/reference`.
- Beginner frontend integration course at `/guide`.

## Requirements

- Node.js 20 or newer.
- npm.

## Installation

```bash
npm install
```

## Running locally

```bash
npm run start:dev
```

The server listens on `http://localhost:3000`. Development data is saved in `db.sqlite` in the project root.

## Available routes

| Route | Purpose |
| --- | --- |
| `GET /` | Basic health/welcome response. |
| `GET /reference` | Scalar interactive API reference. |
| `GET /guide` | Step-by-step frontend integration course. |
| `POST /auth/register` | Register an account. |
| `POST /auth/login` | Receive an access token. |
| `/assets/*` | Authenticated asset and valuation API. |

## API documentation

Open `http://localhost:3000/reference` after starting the API. Use the **Authentication** endpoints to register and log in, copy the returned access token, then use Scalar's **Authorize** control to test protected **Assets** endpoints.

## Response format

Successful asset endpoints use the following response envelope:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {}
}
```

## Project structure

- `src/auth` - authentication service, JWT strategy, guard, and DTOs.
- `src/assets` - asset and valuation endpoints, DTOs, entities, and service.
- `src/common` - shared decorators, response interceptor, and exception filter.
- `src/main.ts` - server bootstrap and Scalar configuration.
- `src/app.controller.ts` - root endpoint and the HTML learning guide.
