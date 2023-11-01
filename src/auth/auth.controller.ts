import { Controller, Post, Body, ValidationPipe, UseGuards, Delete, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { LoginCredentialsDto } from './dto/Login-credential.dto'
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { refreshTokenDto } from './dto/refresh-token.dto';
import { LoginService } from './login.service';
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  // 의존성 주입
  constructor(
    private authService: AuthService,
    private loginService: LoginService
    ) {}

  // 회원가입 (완료)
  @Post('signup')
  async signUp( @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto ): Promise<void> {
    
    return this.authService.signUp(authCredentialsDto)
  };

  // 회원탈퇴
  @Delete('dropout')
  @UseGuards(AuthGuard())
  async dropOut(@GetUser() user: User): Promise<void> {
    return this.authService.deleteUser(user)
  }

  // 로그인
  @Post('login')
  async logIn(@Body(ValidationPipe) loginCredentialsDto: LoginCredentialsDto): Promise<{ accessToken: string, refreshToken: string }> {
    return this.authService.logIn(loginCredentialsDto)
  }

  // 로그아웃
  @Post('logout')
  @UseGuards(AuthGuard())
  async logOut(@GetUser() user: User, @Res() res: Response): Promise<any> {
    await this.loginService.removeRefreshToken(user.userId)
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    
    return res.status(200).send({ message: '로그아웃 되었습니다.' })
  }

  // accessToken 재발급 (완료)
  @Post('refresh')
  async refresh(@Body(ValidationPipe) refreshTokenDto: refreshTokenDto): Promise<{ newAccessToken: string }> {
    const newAccessToken = (await this.authService.refresh(refreshTokenDto)).accessToken
    return { newAccessToken }
  }
}
