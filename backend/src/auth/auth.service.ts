import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/tokens.type';

@Injectable()
// Registration
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: AuthDto): Promise<Tokens> {
    const candidate = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (candidate) throw new ForbiddenException('User already exists');

    const hash = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hash,
        role: 'user',
        firstName: dto.firstName || null, 
        lastName: dto.lastName || null,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);
    await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);

    return tokens;
  }
// Login
  async signin(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

// Logout
  async logout(userId: number) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    });
    return true;
  }

// Refresh
  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    const tokensInDb = await this.prisma.refreshToken.findMany({
        where: { userId: userId }
    });
    
    if (!tokensInDb || tokensInDb.length === 0) {
        throw new ForbiddenException('Access Denied'); 
    }

    let isValid = false;
    for (const tokenRecord of tokensInDb) {
        const match = await bcrypt.compare(rt, tokenRecord.tokenHash);
        if (match) {
            isValid = true;
            await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id }});
            break;
        }
    }

    if (!isValid) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

// auxiliary methods
  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
        data: {
            userId: userId,
            tokenHash: hash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    })
  }

  async getTokens(userId: number, email: string, role: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      // Access Token
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'at-secret',
          expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as any,
        },
      ),
      // Refresh Token
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'rt-secret',
          expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as any,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}