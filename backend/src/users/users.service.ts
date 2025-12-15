import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, firstName: true, lastName: true, role: true },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: number, dto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: { ...dto },
            select: { id: true, email: true, role: true },
        });
    }

    async remove(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }
}
