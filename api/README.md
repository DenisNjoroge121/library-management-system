
# Library Management System

## Project Overview

This project implements the data layer for a Library
Management System using NestJS, Prisma ORM and PostgreSQL.

## Technologies Used

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL

## Database Models

### 1. User

Stores information about library users.

Fields:
- id
- name
- email
- role
- createdAt

The Role enum defines two user roles:
- PATRON
- LIBRARIAN

### 2. Genre

Stores book categories such as Fiction, Science,
Technology and History.

Fields:
- id
- name

### 3. Book

Stores information about books in the library.

Fields:
- id
- title
- author
- isbn
- publishedYear
- genreId
- createdAt

Each book belongs to one genre.

## Schema Decisions

The Book model references the Genre model using
a foreign key called genreId.

I chose this approach instead of embedding genre
information directly inside each Book record because
it avoids repeating the same genre information across
multiple books.

It also makes updating and managing genres easier.

The relationship is one-to-many because one genre
can contain many books, while each book belongs to
one genre.

## Database Seeding

The seed script inserts:

- 4 genres
- 16 books

The books are distributed across the four genres.

## Database Migration

Prisma migrations are used to create and manage
the PostgreSQL database tables.

## Running the Project

Inside the api directory, run:

npm install

npx prisma migrate dev

npx prisma db seed

npm run start:dev
