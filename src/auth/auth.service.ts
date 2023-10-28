import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { AuthRepository } from './authRepository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  // 의존성 주입
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService
    ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { password, confirm } = authCredentialsDto

    // 비밀번호와 확인용 비밀번호 일치여부 확인
    if ( password !== confirm) {
      throw new ConflictException("Password isn't match")
    }

    return this.authRepository.createUser(authCredentialsDto)
  }

  async logIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
      const { email, password } = authCredentialsDto
      const user = await this.authRepository.findOne({ where: { email } })
      console.log('authService_user', user)

      if (user && (await bcrypt.compare(password, user.password))) {
        const payload = { email } // userId로 바꿔보기
        const accessToken = await this.jwtService.sign(payload)

        return { accessToken }
      } else {
        throw new UnauthorizedException('login failed')
      }

  }

  // async dropOut

  // 
}
