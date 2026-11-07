
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Create the four genres
  const genres = await Promise.all([
    prisma.genre.upsert({
      where: { name: 'Fiction' },
      update: {},
      create: { name: 'Fiction' },
    }),

    prisma.genre.upsert({
      where: { name: 'Science' },
      update: {},
      create: { name: 'Science' },
    }),

    prisma.genre.upsert({
      where: { name: 'Technology' },
      update: {},
      create: { name: 'Technology' },
    }),

    prisma.genre.upsert({
      where: { name: 'History' },
      update: {},
      create: { name: 'History' },
    }),
  ]);

  // Get genre IDs
  const [fiction, science, technology, history] = genres;

  // Create 16 books
  const books = [
    // Fiction
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: 'LIB-001', genreId: fiction.id },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: 'LIB-002', genreId: fiction.id },
    { title: 'Animal Farm', author: 'George Orwell', isbn: 'LIB-003', genreId: fiction.id },
    { title: 'Oliver Twist', author: 'Charles Dickens', isbn: 'LIB-004', genreId: fiction.id },

    // Science
    { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: 'LIB-005', genreId: science.id },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: 'LIB-006', genreId: science.id },
    { title: 'Cosmos', author: 'Carl Sagan', isbn: 'LIB-007', genreId: science.id },
    { title: 'Silent Spring', author: 'Rachel Carson', isbn: 'LIB-008', genreId: science.id },

    // Technology
    { title: 'Clean Code', author: 'Robert Martin', isbn: 'LIB-009', genreId: technology.id },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: 'LIB-010', genreId: technology.id },
    { title: 'Introduction to Algorithms', author: 'Thomas Cormen', isbn: 'LIB-011', genreId: technology.id },
    { title: 'Code Complete', author: 'Steve McConnell', isbn: 'LIB-012', genreId: technology.id },

    // History
    { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: 'LIB-013', genreId: history.id },
    { title: 'The Art of War', author: 'Sun Tzu', isbn: 'LIB-014', genreId: history.id },
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: 'LIB-015', genreId: history.id },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: 'LIB-016', genreId: history.id },
  ];

  // Insert books without creating duplicates
  await prisma.book.createMany({
    data: books,
    skipDuplicates: true,
  });

  console.log('Successfully inserted 4 genres and 16 books!');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
