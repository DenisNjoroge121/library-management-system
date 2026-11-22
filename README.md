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
│       ├── components/     # BookCard, BookGrid, SearchBar, Navbar
│       └── pages/          # HomePage, BookDetail
└── docs/
    └── postman_collection.json
```

---

## Schema Decisions

### Why `Book` references `Genre` rather than embedding it
In our relational schema (`api/prisma/schema.prisma`), `Book` stores a `genreId` foreign key referencing `Genre(id)` via `@relation(fields: [genreId], references: [id])` rather than storing a plain string or embedded object on each book row:

1. **Data Integrity & Consistency:** Storing genres in a dedicated table prevents spelling variations or casing mismatches (e.g., `"Sci-Fi"` vs `"Science Fiction"` vs `"sci fi"`). Every book is guaranteed to reference a valid, canonical genre record.
2. **Single Source of Truth for Updates:** Renaming a genre or updating its description requires updating a single row in the `Genre` table rather than running bulk updates across thousands of `Book` records.
3. **Efficient Filtering & Indexing:** Filtering the catalog by `genreId` uses an indexed integer/UUID foreign-key lookup rather than full-table string comparisons, and querying `GET /genres` to populate frontend filter dropdowns is fast and exact without needing `SELECT DISTINCT` scans over the books table.
4. **Extensibility:** Having a first-class `Genre` entity makes it straightforward to attach metadata (such as descriptions, slugs, or shelf locations) and enforce referential integrity (`onDelete: Restrict`) so genres with active books cannot be accidentally orphaned.

### Modeling in Prisma vs. a Document Database (Stretch Note)
Modeling this catalog in Prisma/PostgreSQL felt noticeably different from a document database like MongoDB in how **relationships and boundaries are declared upfront**. In a document database, it is tempting to embed genre names or user reviews directly inside a `Book` document for single-read convenience, deferring consistency checks to application code. In Prisma, defining explicit foreign keys (`genreId`, `userId`, `bookId`), composite unique constraints (`@@unique([bookId, userId])` on `Review`), and strict TypeScript types generated directly from `schema.prisma` forces you to normalize entities early—trading a bit of initial schema design for compiler-verified `include` queries and database-level referential guarantees.

---

## Setup & Installation

### 1. Backend (`api/`)
```bash
cd api
npm install
cp .env.example .env
# Update DATABASE_URL and JWT_SECRET in api/.env
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
