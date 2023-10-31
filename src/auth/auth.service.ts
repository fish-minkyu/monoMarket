import { Injectable, UnauthorizedException, ConflictException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { LoginCredentialsDto } from './dto/Login-credential.dto'
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { User } from './user.entity'
import { LoginService } from './login.service';

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
      // 해당 유저 찾기

      // 유저 삭제
      const result = await this.authRepository.delete(userId)
      console.log(result)

    } catch (err) {
      console.log(err)
    }
  };

  // 로그인
  async logIn(loginCredentialsDto: LoginCredentialsDto): Promise<{accessToken: string, refreshToken: string}> {
      const { email, password } = loginCredentialsDto
      const user = await this.authRepository.findOne({ where: { email } })
      // console.log('authService_user', user.userId)

      if (user && (await bcrypt.compare(password, user.password))) {
        const payload = { userId: user.userId } 
        const accessToken = this.jwtService.sign(payload)

        const refreshPayload =  { nickname: user.nickname }
        const refreshToken = this.jwtService.sign(refreshPayload, {
          secret: 'masterKey',
          expiresIn: 36000
        })

        // 유저 테이블에 refreshToken 저장
        await this.loginService.setCurrentRefreshToken(refreshToken, user.userId)

        // Body로 accessToken과 refreshToken 전송
        return { accessToken, refreshToken }
      } else {
        throw new UnauthorizedException('login failed')
      }

  }

  // 로그아웃
  // async logOut
}
