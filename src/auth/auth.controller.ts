import { Controller, Post, Body, ValidationPipe, UseGuards, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { LoginCredentialsDto } from './dto/Login-credential.dto'
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  // 의존성 주입
  constructor(private authService: AuthService) {}

  // 회원가입 (완료)
  @Post('signup')
  signUp( @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto ): Promise<void> {
    return this.authService.signUp(authCredentialsDto)
  };
s
  // 회원탈퇴
  @Delete('dropout')
  @UseGuards(AuthGuard())
  dropOut(@GetUser() user: User): Promise<void> {
    return this.authService.deleteUser(user)
  }

  // 로그인
  @Post('login')
  logIn(@Body(ValidationPipe) loginCredentialsDto: LoginCredentialsDto): Promise<{accessToken: string, refreshToken: string}> {
    return this.authService.logIn(loginCredentialsDto)
  }

  // 로그아웃
  @Post('logout')
  @UseGuards(AuthGuard())
  logOut(): void {

  }
}
