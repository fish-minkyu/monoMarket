import { Controller, Post, Body, ValidationPipe, UseGuards, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { LoginCredentialsDto } from './dto/Login-credential.dto'
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  // 의존성 주입
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp( @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto ): Promise<void> {
    return this.authService.signUp(authCredentialsDto)
  };
s
  @Post('login')
  logIn(@Body(ValidationPipe) loginCredentialsDto: LoginCredentialsDto): Promise<{accessToken: string}> {
    return this.authService.logIn(loginCredentialsDto)
  }

  // 회원 탈퇴
  @Delete('dropout')
  @UseGuards(AuthGuard())
  dropOut(): void {

  }

  // 로그아웃
  @Post('logout')
  @UseGuards(AuthGuard())
  logOut(): void {

  }
}
