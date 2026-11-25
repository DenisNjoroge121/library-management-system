import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

function makeSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    const slug = dto.slug?.trim() || makeSlug(dto.name);
    const existing = await this.prisma.genre.findFirst({
      where: {
        OR: [{ name: dto.name }, { slug }],
      },
    });
    if (existing) {
      throw new ConflictException(`Genre "${dto.name}" already exists`);
    }

    return this.prisma.genre.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  async update(id: number, dto: UpdateGenreDto) {
    await this.findOne(id);

    const slug = dto.slug?.trim() || (dto.name ? makeSlug(dto.name) : undefined);

    if (dto.name || slug) {
      const orConditions: any[] = [];
      if (dto.name) orConditions.push({ name: dto.name });
      if (slug) orConditions.push({ slug });

      const duplicate = await this.prisma.genre.findFirst({
        where: {
          OR: orConditions,
          NOT: { id },
        },
      });
      if (duplicate) {
        throw new ConflictException(`A genre with that name or slug already exists`);
      }
    }

    return this.prisma.genre.update({
      where: { id },
      data: {
        ...dto,
        ...(slug ? { slug } : {}),
      },
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
