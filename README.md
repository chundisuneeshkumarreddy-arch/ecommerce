# EcommerceApp

E-commerce REST API built with Node.js, Express, and MongoDB. JWT-based authentication with role-based access (user/admin), product management, and Swagger documentation included.

## Tech Stack

- Node.js + Express 5
- MongoDB (Mongoose 9)
- JWT authentication (jsonwebtoken)
- bcrypt password hashing
- Swagger UI (`swagger-ui-express`)

## Getting Started

1. **Clone and install**
   ```sh
   git clone https://github.com/mmaneeshnow-byte/EcommerceApp.git
   cd EcommerceApp
   npm install
   ```

2. **Create `.env`** (not tracked in git)
   ```
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   PORT=5000
   ```

3. **Start the server**
   ```sh
   npm start
   ```
   You should see `Server running on port 5000` and `MongoDB connected`.

4. **Seed an admin account** (optional)
   ```sh
   node seed.js
   ```
   Creates `admin@example.com` / `Admin@123`.

## API Documentation (Swagger)

Start the server and open:

```
http://localhost:5000/api-docs
```

Interactive docs with "Try it out" support. Click **Authorize** and paste a JWT token to test protected endpoints.

## Authentication

Registration and login return/accept JWT tokens. Protected endpoints require:

```
Authorization: Bearer <token>
```

### Register

```
POST /api/auth/register
```

```json
{
  "username": "jane",
  "email": "jane@test.com",
  "contact": 9123456789,
  "password": "Jane@123",
  "location": "India"
}
```

### Login

```
POST /api/auth/login
```

```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

Response includes a `token` valid for 1 day.

## Roles

| Role | Permissions |
| --- | --- |
| user | View published products |
| admin | Full product CRUD, publish/unpublish, user management |

## Endpoints

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/products` | Logged-in users (users see published only, admins see all) |
| GET | `/api/products/:id` | Logged-in users |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |
| PATCH | `/api/products/:id/publish` | Admin |
| PATCH | `/api/products/:id/unpublish` | Admin |
| GET | `/api/users` | Admin |
| GET | `/api/users/:id` | Admin |
| PATCH | `/api/users/:id/role` | Admin |
| DELETE | `/api/users/:id` | Admin |

### Product queries (GET `/api/products`)

Filter, sort and paginate:

```
?category=Electronics&minPrice=100&maxPrice=50000&sort=price_asc&page=1&limit=10
```

- `category` — case-insensitive partial match
- `minPrice` / `maxPrice` — price range
- `sort` — `price_asc` | `price_desc` | `newest`
- `page` / `limit` — pagination

## Project Structure

```
├── config/          # DB connection, Swagger spec
├── controllers/     # Route handlers (auth, product, user)
├── middleware/      # JWT auth + role guards
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── app.js           # Express app setup
├── server.js        # Entry point
└── seed.js          # Admin seeding script
```