import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecordDto } from './dto/create-record.dto';

@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateRecordDto) {
    return this.prisma.record.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId: userId,
      },
    });
  }

  async findAll(userId: number, role: string) {
    if (role === 'admin') {
      return this.prisma.record.findMany({
        orderBy: { createdAt: 'desc' },
        include: { 
          author: { 
            select: { email: true, firstName: true, lastName: true } 
          } 
        }
      });
    }

    return this.prisma.record.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number, role: string) {
    const record = await this.prisma.record.findUnique({ 
        where: { id },
        include: {
            author: role === 'admin' ? { select: { email: true, firstName: true, lastName: true } } : false
        }
    });

    if (!record) throw new NotFoundException('Record not found');
    if (role !== 'admin' && record.authorId !== userId) {
        throw new ForbiddenException('Access to this record denied');
    } 

    return record;
  }

  async remove(id: number, userId: number, role) {
    await this.findOne(id, userId, role);
    return this.prisma.record.delete({ where: { id } });
  }
}