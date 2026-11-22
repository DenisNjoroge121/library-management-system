import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Library Management System database...');

  // 1. Seed Users (1 Librarian, 1 Patron)
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

  // 2. Seed Genres (5 genres)
  const genreData = [
    {
      name: 'Science Fiction',
      description: 'Speculative stories exploring futuristic technology, space travel, and alternate worlds.',
    },
    {
      name: 'Computer Science',
      description: 'Algorithms, software engineering, distributed systems, and computing theory.',
    },
    {
      name: 'History',
      description: 'Non-fiction accounts of civilizations, historical events, and biographies.',
    },
    {
      name: 'Mystery & Thriller',
      description: 'Suspenseful detective fiction, crime investigations, and psychological thrillers.',
    },
    {
      name: 'Literary Fiction',
      description: 'Character-driven narratives exploring the human condition and society.',
    },
  ];

  const genres: Record<string, number> = {};
  for (const g of genreData) {
    const created = await prisma.genre.upsert({
      where: { name: g.name },
      update: { description: g.description },
      create: g,
    });
    genres[g.name] = created.id;
  }

  // 3. Seed Books (18 books across the 5 genres)
  const booksData = [
    // Science Fiction (4)
    {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '9780441172719',
      description: 'Set on the desert planet Arrakis, Paul Atreides navigates politics, ecology, and destiny.',
      publishedYear: 1965,
      totalCopies: 6,
      availableCopies: 5,
      genreId: genres['Science Fiction'],
    },
    {
      title: 'The Left Hand of Darkness',
      author: 'Ursula K. Le Guin',
      isbn: '9780441478125',
      description: 'An envoy from Earth visits the wintry planet Gethen to negotiate an interplanetary alliance.',
      publishedYear: 1969,
      totalCopies: 4,
      availableCopies: 4,
      genreId: genres['Science Fiction'],
    },
    {
      title: 'Neuromancer',
      author: 'William Gibson',
      isbn: '9780441569595',
      description: 'A washed-up console cowboy is hired for one last hack in a neon-soaked cyberspace future.',
      publishedYear: 1984,
      totalCopies: 5,
      availableCopies: 3,
      genreId: genres['Science Fiction'],
    },
    {
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      isbn: '9780593135204',
      description: 'A lone astronaut wakes up light-years from Earth with amnesia and a mission to save the sun.',
      publishedYear: 2021,
      totalCopies: 7,
      availableCopies: 6,
      genreId: genres['Science Fiction'],
    },

    // Computer Science (4)
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      isbn: '9781449373320',
      description: 'The big ideas behind reliable, scalable, and maintainable distributed data systems.',
      publishedYear: 2017,
      totalCopies: 8,
      availableCopies: 6,
      genreId: genres['Computer Science'],
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      description: 'A handbook of agile software craftsmanship and writing readable, maintainable code.',
      publishedYear: 2008,
      totalCopies: 5,
      availableCopies: 4,
      genreId: genres['Computer Science'],
    },
    {
      title: 'Structure and Interpretation of Computer Programs',
      author: 'Harold Abelson & Gerald Jay Sussman',
      isbn: '9780262510875',
      description: 'Classic computer science text covering abstraction, recursion, and interpreters.',
      publishedYear: 1996,
      totalCopies: 4,
      availableCopies: 4,
      genreId: genres['Computer Science'],
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt & David Thomas',
      isbn: '9780135957059',
      description: 'Practical advice and timeless habits for modern software developers.',
      publishedYear: 2019,
      totalCopies: 6,
      availableCopies: 5,
      genreId: genres['Computer Science'],
    },

    // History (4)
    {
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      isbn: '9780062316097',
      description: 'A sweeping narrative of how Homo sapiens came to dominate the planet.',
      publishedYear: 2014,
      totalCopies: 7,
      availableCopies: 5,
      genreId: genres['History'],
    },
    {
      title: 'The Silk Roads: A New History of the World',
      author: 'Peter Frankopan',
      isbn: '9781101912379',
      description: 'A reassessment of world history centered on the trade networks connecting East and West.',
      publishedYear: 2015,
      totalCopies: 4,
      availableCopies: 3,
      genreId: genres['History'],
    },
    {
      title: 'Guns, Germs, and Steel',
      author: 'Jared Diamond',
      isbn: '9780393317558',
      description: 'An exploration of the geographic and environmental factors that shaped human civilizations.',
      publishedYear: 1997,
      totalCopies: 5,
      availableCopies: 5,
      genreId: genres['History'],
    },
    {
      title: 'The Innovators',
      author: 'Walter Isaacson',
      isbn: '9781476708690',
      description: 'How a group of hackers, geniuses, and geeks created the digital revolution.',
      publishedYear: 2014,
      totalCopies: 5,
      availableCopies: 4,
      genreId: genres['History'],
    },

    // Mystery & Thriller (3)
    {
      title: 'The Girl with the Dragon Tattoo',
      author: 'Stieg Larsson',
      isbn: '9780307454546',
      description: 'A journalist and a brilliant hacker investigate a decades-old disappearance in Sweden.',
      publishedYear: 2005,
      totalCopies: 5,
      availableCopies: 4,
      genreId: genres['Mystery & Thriller'],
    },
    {
      title: 'And Then There Were None',
      author: 'Agatha Christie',
      isbn: '9780062073488',
      description: 'Ten strangers are lured to an isolated island mansion where a deadly game unfolds.',
      publishedYear: 1939,
      totalCopies: 6,
      availableCopies: 6,
      genreId: genres['Mystery & Thriller'],
    },
    {
      title: 'The Shadow of the Wind',
      author: 'Carlos Ruiz Zafón',
      isbn: '9780143034902',
      description: 'In post-war Barcelona, a young boy discovers a mysterious book that changes his life.',
      publishedYear: 2001,
      totalCopies: 4,
      availableCopies: 3,
      genreId: genres['Mystery & Thriller'],
    },

    // Literary Fiction (3)
    {
      title: 'Things Fall Apart',
      author: 'Chinua Achebe',
      isbn: '9780385474542',
      description: 'The story of Okonkwo, a respected Igbo leader, and the impact of colonialism in Nigeria.',
      publishedYear: 1958,
      totalCopies: 8,
      availableCopies: 7,
      genreId: genres['Literary Fiction'],
    },
    {
      title: 'One Hundred Years of Solitude',
      author: 'Gabriel García Márquez',
      isbn: '9780060883287',
      description: 'The multi-generational saga of the Buendía family in the mythical town of Macondo.',
      publishedYear: 1967,
      totalCopies: 5,
      availableCopies: 4,
      genreId: genres['Literary Fiction'],
    },
    {
      title: 'Beloved',
      author: 'Toni Morrison',
      isbn: '9781400033416',
      description: 'Set after the American Civil War, a formerly enslaved woman is haunted by her past.',
      publishedYear: 1987,
      totalCopies: 5,
      availableCopies: 5,
      genreId: genres['Literary Fiction'],
    },
  ];

  for (const book of booksData) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: book,
      create: book,
    });
  }

  // 4. Seed sample Review (Stretch model)
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
        comment: 'A monumental achievement in world-building and ecological sci-fi.',
      },
    });
  }

  console.log(`Seed complete: ${Object.keys(genres).length} genres, ${booksData.length} books, 2 users (${librarian.email}, ${patron.email}).`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
