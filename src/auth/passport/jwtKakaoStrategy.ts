import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-kakao'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthRepository } from '../auth.repository'
import { LoginService } from "../login.service";
import { ProviderStatus } from "src/auth/provider-status.enum";
import { InternalServerErrorException } from '@nestjs/common'
import { User } from '../user.entity'

export class jwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    @InjectRepository(AuthRepository) 
    private authRepository: AuthRepository,
    private loginService: LoginService) {
    super({
      clientID: process.env.KAKAO_ID,
      callbackURL: "/auth/kakao/callback",
    });
  };

  async validate( accessToken: string, refreshToken: string, profile: any) {

  }
};
