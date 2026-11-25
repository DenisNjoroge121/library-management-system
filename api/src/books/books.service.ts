import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: dto.genreId },
    });
    if (!genre) {
      throw new BadRequestException(`Genre with ID ${dto.genreId} does not exist`);
    }

    const existingIsbn = await this.prisma.book.findUnique({
      where: { isbn: dto.isbn },
    });
    if (existingIsbn) {
      throw new ConflictException(`A book with ISBN "${dto.isbn}" already exists`);
    }

    const availableCopies =
      dto.availableCopies !== undefined ? dto.availableCopies : dto.totalCopies;

    if (availableCopies > dto.totalCopies) {
      throw new BadRequestException('availableCopies cannot exceed totalCopies');
    }

    return this.prisma.book.create({
      data: {
        title: dto.title,
        author: dto.author,
        isbn: dto.isbn,
        description: dto.description,
        coverImage: dto.coverImage,
        publishedYear: dto.publishedYear,
        totalCopies: dto.totalCopies,
        availableCopies,
        genreId: dto.genreId,
      },
      include: {
        genre: true,
      },
    });
  }

  async findAll(
    genreId?: string,
    search?: string,
    page = 1,
    limit = 20,
    sortBy: 'title' | 'author' | 'createdAt' = 'title',
    order: 'asc' | 'desc' = 'asc',
  ) {
    const safePage = page > 0 ? Number(page) : 1;
    const safeLimit = limit > 0 ? Number(limit) : 20;
    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.BookWhereInput = {
      ...(genreId ? { genreId: Number(genreId) } : {}),
      ...(search && search.trim() !== ''
        ? {
            OR: [
              { title: { contains: search.trim(), mode: 'insensitive' } },
              { author: { contains: search.trim(), mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const allowedSortFields = ['title', 'author', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'title';
    const sortOrder: Prisma.SortOrder = order === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: { genre: true },
        skip,
        take: safeLimit,
        orderBy: { [sortField]: sortOrder },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book ${id} not found`);
    }

    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    const existing = await this.findOne(id);

    if (dto.genreId) {
      const genre = await this.prisma.genre.findUnique({
        where: { id: dto.genreId },
      });
      if (!genre) {
        throw new BadRequestException(`Genre with ID ${dto.genreId} does not exist`);
      }
    }

    if (dto.isbn && dto.isbn !== existing.isbn) {
      const duplicateIsbn = await this.prisma.book.findUnique({
        where: { isbn: dto.isbn },
      });
      if (duplicateIsbn) {
        throw new ConflictException(`A book with ISBN "${dto.isbn}" already exists`);
      }
    }

    const nextTotal = dto.totalCopies ?? existing.totalCopies;
    const nextAvailable = dto.availableCopies ?? existing.availableCopies;
    if (nextAvailable > nextTotal) {
      throw new BadRequestException('availableCopies cannot exceed totalCopies');
    }

    return this.prisma.book.update({
      where: { id },
      data: dto,
      include: { genre: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
