import { Injectable, UnauthorizedException, ConflictException, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { LoginCredentialsDto } from './dto/Login-credential.dto'
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { User } from './user.entity'
import { LoginService } from './login.service';
import { refreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  // 의존성 주입
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private loginService: LoginService
    ) {}

  // 회원가입
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { password, confirm } = authCredentialsDto

    // 비밀번호와 확인용 비밀번호 일치여부 확인
    if ( password !== confirm) {
      throw new ConflictException("Password isn't match")
    }

    return this.authRepository.createUser(authCredentialsDto)
  }

  // 회원탈퇴
  async deleteUser(user: User): Promise<void> {
    const userId = user.userId
    try {
      // 해당 유저 쿠키 없애기

      // 유저 삭제
      const result = await this.authRepository.delete(userId)
      console.log(result)

    } catch (err) {
      console.log(err)
      throw new ConflictException()
    }
  };

  // 로그인
  async logIn(loginCredentialsDto: LoginCredentialsDto): Promise<{accessToken: string, refreshToken: string}> {
      const { email, password } = loginCredentialsDto
      const user = await this.authRepository.findOne({ where: { email } })
      // console.log('authService_user', user.userId)

      if (user && (await bcrypt.compare(password, user.password))) {

        // accessToken & refreshToken 발행
        const accessToken = await this.loginService.issueAccessToken(user.email, user.provider)
        const refreshToken = await this.loginService.issueRefreshToken(user.userId)

        // DB, 유저 테이블에 refreshToken 저장
        await this.loginService.setCurrentRefreshToken(refreshToken, user.userId)

        // Body로 accessToken과 refreshToken 전송
        return { accessToken, refreshToken }
      } else {
        throw new UnauthorizedException('login failed')
      }
  };

  // refreshToken으로 accessToken 재발급
  async refresh(refreshTokenDto: refreshTokenDto): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDto

    try {
      // refreshToken 검증
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {secret: 'masterKey'})

      const userId = decodedRefreshToken.userId
      const user = await this.loginService.getUserIfRefreshTokenMatches(refreshToken, userId)
      if (!user) {
        throw new UnauthorizedException('유효하지 않는 유저입니다.')
      }

      const payload = { email: user.email } 
      const accessToken = this.jwtService.sign(payload)

      return { accessToken }
    } catch (err) {
      console.log(err)
      throw new ConflictException('재로그인을 해주세요.')
    }
  };

  // 소셜 로그인
  async OAuthLogin({ req, res }): Promise<{accessToken: string, refreshToken: string}> {
    try {
      const user = await this.authRepository.findOne({ where: { email: req.user.email, provider: req.user.provider }})

      if (!user) {
        const user = await this.authRepository.createOAuth(req.user.email, req.user.nickname, req.user.provider)
        
        // accessToken & refreshToken 발행
        const accessToken = await this.loginService.issueAccessToken(user.email, user.provider)
        const refreshToken = await this.loginService.issueRefreshToken(user.userId)
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)

        return { accessToken, refreshToken }
      }
      
      // accessToken & refreshToken 발행
      console.log('user.email', user.email)
      const accessToken = await this.loginService.issueAccessToken(user.email, user.provider)
      const refreshToken = await this.loginService.issueRefreshToken(user.userId)

      console.log('accessToken', accessToken)
      console.log('refreshToken', refreshToken)
      
      return { accessToken, refreshToken }
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException()
    }
  };
};
