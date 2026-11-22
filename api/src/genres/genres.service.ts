import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    const existing = await this.prisma.genre.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Genre "${dto.name}" already exists`);
    }

    return this.prisma.genre.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { books: true },
        },
      },
    });
  }

  async findOne(id: number) {
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

  async update(id: number, dto: UpdateGenreDto) {
    await this.findOne(id);

    if (dto.name) {
      const duplicate = await this.prisma.genre.findFirst({
        where: { name: dto.name, NOT: { id } },
      });
      if (duplicate) {
        throw new ConflictException(`Genre "${dto.name}" already exists`);
      }
    }

    return this.prisma.genre.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { books: true } } },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    if (genre._count.books > 0) {
      throw new BadRequestException(
        `Cannot delete genre "${genre.name}" because ${genre._count.books} book(s) still reference it`,
      );
    }

    return this.prisma.genre.delete({
      where: { id },
    });
  }
}
