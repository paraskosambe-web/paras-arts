# Paras Arts — Backend (Express + MongoDB)

MERN backend for the Paras Arts frontend. MVC architecture with JWT admin auth, bcrypt password hashing, and Multer image uploads.

## Setup

```bash
cd server
cp .env.example .env         # fill in MONGO_URI, JWT_SECRET, admin creds
npm install
npm run seed                 # creates the initial admin user
npm run dev                  # http://localhost:5000
```

## Environment

| Variable         | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `PORT`           | API port (default 5000)                            |
| `MONGO_URI`      | MongoDB Atlas connection string                    |
| `JWT_SECRET`     | Secret for signing admin JWTs                      |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`)                      |
| `CLIENT_ORIGIN`  | Comma-separated allowed CORS origins               |
| `ADMIN_EMAIL`    | Seed admin email                                   |
| `ADMIN_PASSWORD` | Seed admin password                                |

## Folder structure

```
server/
├── config/         # db connection
├── controllers/    # request handlers
├── middleware/     # auth (JWT), upload (multer), errorHandler
├── models/         # Mongoose schemas
├── routes/         # /api/* routers
├── uploads/        # multer disk storage (served at /uploads)
├── server.js       # entry point
└── seed.js         # create initial admin
```

## API endpoints

### Auth (`/api/auth`)
- `POST /login` — `{ email, password }` → `{ token, admin }`
- `GET  /me` — 🔒 returns current admin

### Artworks (`/api/artworks`)
- `GET    /?search=&category=&page=&limit=` — list
- `GET    /:id` — single
- `POST   /` — 🔒 multipart, field `image` — create
- `PUT    /:id` — 🔒 multipart optional `image` — update
- `DELETE /:id` — 🔒

### Orders (`/api/orders`)
- `POST   /` — public, multipart optional `referenceImage` — customer submits order
- `GET    /?search=&status=&page=&limit=` — 🔒
- `GET    /stats` — 🔒 pending/completed/total counters
- `PATCH  /:id/status` — 🔒 `{ status }`
- `DELETE /:id` — 🔒

### Messages (`/api/messages`)
- `POST   /` — public, contact form
- `GET    /` — 🔒
- `PATCH  /:id/read` — 🔒
- `DELETE /:id` — 🔒

### Testimonials / Services / FAQs
Same CRUD shape: `GET` public, `POST/PUT/DELETE` 🔒. Testimonials accept image upload.

🔒 = requires `Authorization: Bearer <token>`.

## Frontend integration

The React frontend uses `VITE_API_URL` to reach this API. Set it in the frontend `.env`:

```
VITE_API_URL=http://localhost:5000
```

For production, deploy this server to Render / Railway / Fly / a VPS, then point `VITE_API_URL` at the deployed URL and add that domain to `CLIENT_ORIGIN` here.
