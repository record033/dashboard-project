import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: hashedPassword,
                role: 'admin',
                firstName: 'Super',
                lastName: 'Admin',
                records: {
                    create: [
                        { title: 'admin title 1', content: 'test first text in system' },
                        { title: 'title 2', content: 'all is violent, all is bright' },
                    ],
                },
            },
        });
    } else {
    }

    const userEmail = 'user@example.com';
    const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash('user123', 10);
        await prisma.user.create({
            data: {
                email: userEmail,
                passwordHash: hashedPassword,
                role: 'user',
                firstName: 'John',
                lastName: 'Doe',
                records: {
                    create: [{ title: 'first user title', content: 'therefore i exist' }],
                },
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
