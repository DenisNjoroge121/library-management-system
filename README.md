# Library Management System

A full-stack Library Management System built with **NestJS**, **Prisma** (PostgreSQL), and **React (Vite + Tailwind CSS)**. It features role-based authentication (JWT + bcrypt), full catalog CRUD operations, query-based search and pagination, and a responsive patron-facing catalog UI.

---

## Project Structure

```text
library-management-system/
├── api/                    # NestJS backend + Prisma ORM
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema (User, Genre, Book, Review)
│   │   └── seed.ts         # Idempotent seed script (5 genres, 18 books, sample users)
│   └── src/
│       ├── auth/           # JWT strategy, guards, roles decorator, login/register
│       ├── books/          # Books CRUD, filtering, search, pagination
│       ├── genres/         # Genres CRUD
│       ├── prisma/         # PrismaService with OnModuleInit
│       └── users/          # User profile endpoint
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # BookCard, BookGrid, SearchBar
│       └── pages/          # HomePage, BookDetail
└── docs/
    └── postman_collection.json
```

---

## Schema Decisions

### Why `Book` references `Genre` rather than embedding it
`Book` references `Genre` via a `genreId` foreign key (`@relation(fields: [genreId], references: [id])`) rather than embedding the genre name or object directly because many books share one genre and genres are managed independently:

1. **Single Source of Truth for Updates:** Renaming a genre or updating its `slug` or `description` should not require updating every book row across the catalog.
2. **Data Integrity & Consistency:** Storing genres in a dedicated table prevents spelling or casing duplicates and guarantees every book references a valid canonical `Genre` record.
3. **Strict Role Modeling:** `User` stores a `role` field using a `Role` enum (`PATRON` | `LIBRARIAN`) so PostgreSQL and TypeScript both enforce valid roles.
4. **Efficient Filtering & Extensibility:** Filtering by `genreId` uses a foreign-key index, and a dedicated `Genre` table allows adding metadata or enforcing `onDelete: Restrict` so genres with books cannot be accidentally removed.

### Modeling in Prisma vs. a Document Database (Stretch Note)
Modeling in Prisma/PostgreSQL differs from a document database like MongoDB in how upfront normalization and relational constraints are enforced. In a document database, it is common to embed related data in a single document for convenience and validate shapes at the application layer, whereas Prisma requires explicit relations (`genreId`, `userId`, `bookId`), composite constraints (`@@unique([bookId, userId])`), and generated TypeScript types that catch relational mismatches at compile time.

---

## Setup & Installation

### 1. Backend (`api/`)
```bash
cd api
npm install
cp .env.example .env
# Set DATABASE_URL and JWT_SECRET in api/.env
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

### 2. Frontend (`client/`)
```bash
cd client
npm install
npm run dev
```

### 3. Default Seeded Accounts
- **Librarian:** `librarian@library.local` / `Librarian123!`
- **Patron:** `patron@library.local` / `Patron123!`
