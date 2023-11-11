import { Controller, Post, Body, ValidationPipe, UseGuards, Delete, Req, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { LoginCredentialsDto } from './dto/Login-credential.dto'
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { refreshTokenDto } from './dto/refresh-token.dto';
import { LoginService } from './login.service';
import { Request, Response } from 'express'
import { OAuthCredentialDto } from './dto/OAuth-credential.dto'

@Controller('auth')
export class AuthController {
  // 의존성 주입
  constructor(
    private authService: AuthService,
    private loginService: LoginService
    ) {}
  // 임시 로그인 완료 라우트 (완료)
  @Get('/')
  async success(@Res() res: Response) {
    res.send({ message: 'login success'})
  }

  // 회원가입 (완료)
  @Post('signup')
  async signUp( @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto ): Promise<void> {
    
    return this.authService.signUp(authCredentialsDto)
  };

  // 로그인 (완료)
  @Post('login')
  async logIn(@Body(ValidationPipe) loginCredentialsDto: LoginCredentialsDto): Promise<{ accessToken: string, refreshToken: string }> {
    return this.authService.logIn(loginCredentialsDto)
  };

  // 카카오 소셜 로그인 (완료) // /kakao -> @UseGuards(AuthGuard('kakao')) -> jwtKakaoStrategy -> kakaoLogin()
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(
    @Req() req: Request & OAuthCredentialDto, 
    @Res() res: Response) {
      this.authService.OAuthLogin({ req, res })
      res.redirect('/auth')
  };

  // 네이버 소셜 로그인 (완료)
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin(
    @Req() req: Request & OAuthCredentialDto, //* Q. OAuthCredentialDto는 왜 필요한가? req 객체안에 user값이 있을텐데
    @Res() res: Response) { //* OAuthCredentialDto는 req객체가 OAuth 인증 정보를 포함하도록 강제한다. 클라이언트가 보낸 OAuth 인증 정보가 올바른 형식을 가지고 있는지 확인한다. 즉, 이 객체는 클라이언트가 서버로 인증 정보를 안전하고 표준화된 형식으로 전달할 수 있도록 해준다.
      this.authService.OAuthLogin({ req, res })
      res.redirect('/auth')
  };

  // 구글 소셜 로그인 (완료)
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(
    @Req() req: Request & OAuthCredentialDto,
    @Res() res: Response) {
      this.authService.OAuthLogin({ req, res })
      res.redirect('/auth')
  };

  // accessToken 재발급 (완료)
  @Post('refresh')
  async refresh(@Body(ValidationPipe) refreshTokenDto: refreshTokenDto): Promise<{ newAccessToken: string }> {
    const newAccessToken = (await this.authService.refresh(refreshTokenDto)).accessToken
    return { newAccessToken }
  };

  // 로그아웃 (완료)
  @Post('logout')
  @UseGuards(AuthGuard())
  async logOut(
    @GetUser() user: User, 
    @Res() res: Response
    ): Promise<any> {
    await this.loginService.removeRefreshToken(user.userId)
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    return res.status(200).send({ message: '로그아웃 되었습니다.' })
  };

  // 회원탈퇴 (완료)
  @Delete('dropout')
  @UseGuards(AuthGuard())
  async dropOut(@GetUser() user: User): Promise<void> {
    return this.authService.deleteUser(user)
  };
};
