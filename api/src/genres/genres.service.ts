
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  // CREATE: Add a new genre
  async create(createGenreDto: CreateGenreDto) {
    const existingGenre = await this.prisma.genre.findUnique({
      where: {
        name: createGenreDto.name,
      },
    });

    if (existingGenre) {
      throw new ConflictException('Genre already exists');
    }

    return this.prisma.genre.create({
      data: createGenreDto,
    });
  }

  // READ: Get all genres
  async findAll() {
    return this.prisma.genre.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
    });
  }

  // READ: Get one genre
  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  // UPDATE: Modify an existing genre
  async update(id: string, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id);

    if (updateGenreDto.name) {
      const existingGenre = await this.prisma.genre.findUnique({
        where: {
          name: updateGenreDto.name,
        },
      });

      if (existingGenre && existingGenre.id !== id) {
        throw new ConflictException('Genre name already exists');
      }
    }

    return this.prisma.genre.update({
      where: { id },
      data: updateGenreDto,
    });
  }

  // DELETE: Remove a genre
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.genre.delete({
      where: { id },
    });
  }
}
