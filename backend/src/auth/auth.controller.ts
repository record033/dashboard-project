import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import type { Response } from 'express';
import { AtGuard } from '../common/guards/at.guard'; 
import { RtGuard } from '../common/guards/rt.guard'; 
import { GetCurrentUser } from '../common/decorators/get-current-user-decorator'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signup(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.signup(dto);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { access_token: tokens.access_token };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.signin(dto);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { access_token: tokens.access_token };
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUser('sub') userId: number, 
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logout(userId); 
    res.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }

  @UseGuards(RtGuard) 
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUser('sub') userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: tokens.access_token };
  }

  @UseGuards(AtGuard)
  @Get('me')
  getProfile(@GetCurrentUser() user: any) {
    return user;
  }
}