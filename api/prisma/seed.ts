import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('Seeding Library Management System database...');

  const librarianPassword = await bcrypt.hash('Librarian123!', 10);
  const patronPassword = await bcrypt.hash('Patron123!', 10);

  const librarian = await prisma.user.upsert({
    where: { email: 'librarian@library.local' },
    update: {},
    create: {
      email: 'librarian@library.local',
      name: 'Grace Hopper',
      password: librarianPassword,
      role: Role.LIBRARIAN,
    },
  });

  const patron = await prisma.user.upsert({
    where: { email: 'patron@library.local' },
    update: {},
    create: {
      email: 'patron@library.local',
      name: 'Ada Lovelace',
      password: patronPassword,
      role: Role.PATRON,
    },
  });

  const genreNames = [
    'Fantasy',
    'Science Fiction',
    'Mystery',
    'Biography',
    'Computer Science',
  ];

  const genresByName: Record<string, number> = {};
  for (const name of genreNames) {
    const slug = toSlug(name);
    const created = await prisma.genre.upsert({
      where: { name },
      update: { slug },
      create: {
        name,
        slug,
        description: `${name} titles in the library catalog.`,
      },
    });
    genresByName[name] = created.id;
  }

  const sampleBooks = [
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '9780547928227',
      genre: 'Fantasy',
      description: 'Bilbo Baggins embarks on an unexpected quest across Middle-earth.',
      totalCopies: 5,
      availableCopies: 4,
    },
    {
      title: 'A Wizard of Earthsea',
      author: 'Ursula K. Le Guin',
      isbn: '9780547773742',
      genre: 'Fantasy',
      description: 'A young mage learns the weight of true names and balance in an archipelago world.',
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      isbn: '9780756404741',
      genre: 'Fantasy',
      description: 'Kvothe recounts his journey from troupe performer to legendary arcanist.',
      totalCopies: 6,
      availableCopies: 5,
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '9780441172719',
      genre: 'Science Fiction',
      description: 'Set on the desert planet Arrakis, Paul Atreides navigates politics and ecology.',
      totalCopies: 6,
      availableCopies: 5,
    },
    {
      title: 'Neuromancer',
      author: 'William Gibson',
      isbn: '9780441569595',
      genre: 'Science Fiction',
      description: 'A console cowboy takes on one final high-stakes job in cyberspace.',
      totalCopies: 4,
      availableCopies: 3,
    },
    {
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      isbn: '9780593135204',
      genre: 'Science Fiction',
      description: 'A lone astronaut wakes up light-years from Earth with a mission to save humanity.',
      totalCopies: 5,
      availableCopies: 4,
    },
    {
      title: 'Foundation',
      author: 'Isaac Asimov',
      isbn: '9780553293357',
      genre: 'Science Fiction',
      description: 'Psychohistory guides a foundation established to preserve knowledge across galaxies.',
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      title: 'The Big Sleep',
      author: 'Raymond Chandler',
      isbn: '9780394758282',
      genre: 'Mystery',
      description: 'Private detective Philip Marlowe is drawn into blackmail and murder in Los Angeles.',
      totalCopies: 4,
      availableCopies: 3,
    },
    {
      title: 'And Then There Were None',
      author: 'Agatha Christie',
      isbn: '9780062073488',
      genre: 'Mystery',
      description: 'Ten strangers gather on an isolated island where secrets carry deadly consequences.',
      totalCopies: 6,
      availableCopies: 6,
    },
    {
      title: 'The Hound of the Baskervilles',
      author: 'Arthur Conan Doyle',
      isbn: '9780140437867',
      genre: 'Mystery',
      description: 'Sherlock Holmes and Dr. Watson investigate a legendary phantom hound on the moors.',
      totalCopies: 5,
      availableCopies: 4,
    },
    {
      title: 'Educated',
      author: 'Tara Westover',
      isbn: '9780399590504',
      genre: 'Biography',
      description: 'A memoir of resilience, self-education, and transformation from mountain survival to academia.',
      totalCopies: 6,
      availableCopies: 5,
    },
    {
      title: 'The Innovators',
      author: 'Walter Isaacson',
      isbn: '9781476708690',
      genre: 'Biography',
      description: 'The story of the pioneers and collaborators who built modern computing and the internet.',
      totalCopies: 5,
      availableCopies: 4,
    },
    {
      title: 'Surely You re Joking, Mr. Feynman!',
      author: 'Richard P. Feynman',
      isbn: '9780393316049',
      genre: 'Biography',
      description: 'Adventures, curiosity, and insights from physicist Richard Feynman.',
      totalCopies: 4,
      availableCopies: 3,
    },
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      isbn: '9781449373320',
      genre: 'Computer Science',
      description: 'Core principles behind reliable, scalable, and maintainable data systems.',
      totalCopies: 7,
      availableCopies: 5,
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      genre: 'Computer Science',
      description: 'A practical guide to writing clean, maintainable, and testable software.',
      totalCopies: 5,
      availableCopies: 4,
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt & David Thomas',
      isbn: '9780135957059',
      genre: 'Computer Science',
      description: 'Foundational engineering practices for building adaptable software.',
      totalCopies: 5,
      availableCopies: 5,
    },
  ];

  for (const book of sampleBooks) {
    const genreId = genresByName[book.genre];
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        title: book.title,
        author: book.author,
        description: book.description,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        genreId,
      },
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        genreId,
      },
    });
  }

  const dune = await prisma.book.findUnique({ where: { isbn: '9780441172719' } });
  if (dune) {
    await prisma.review.upsert({
      where: {
        bookId_userId: {
          bookId: dune.id,
          userId: patron.id,
        },
      },
      update: {},
      create: {
        bookId: dune.id,
        userId: patron.id,
        rating: 5,
        comment: 'Rich world-building and memorable characters.',
      },
    });
  }

  console.log(
    `Seed complete: ${genreNames.length} genres, ${sampleBooks.length} books, users: ${librarian.email}, ${patron.email}`,
  );
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
