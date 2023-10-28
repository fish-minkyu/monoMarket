import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthRepository } from './authRepository';
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // 의존성 주입
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService
    ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authRepository.createUser(authCredentialsDto)
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<accessToken: string> {
      const { email, password } = authCredentialsDto
      const user = await this.authRepository.findOne( where: { email } )
  }

  // async dropOut

  // 
}
