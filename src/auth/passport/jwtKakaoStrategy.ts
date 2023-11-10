import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-kakao'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthRepository } from '../auth.repository'
import { LoginService } from "../login.service";
import { ProviderStatus } from "src/auth/provider-status.enum";

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    @InjectRepository(AuthRepository) 
    private authRepository: AuthRepository,
    private loginService: LoginService) {
    super({
      clientID: process.env.KAKAO_ID,
      callbackURL: "/auth/kakao",
    });
  };

  async validate( accessToken: string, refreshToken: string, profile: any) {

    try {
      return {
        email: profile._json?.kakao_account?.email,
        nickname: profile.displayName,
        provider: ProviderStatus.kakao
      }
    } catch (err) {
      console.error('jwtKakaoStrategy', err)
    }
   
  }
};
