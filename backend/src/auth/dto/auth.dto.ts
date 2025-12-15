import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class AuthDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;
}
