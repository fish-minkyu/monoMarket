import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver-v2";
import { ProviderStatus } from "../provider-status.enum";

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVER_SECRET,
      callbackURL: '/auth/naver'
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile);

    return {
     email: profile?.email,
     nickname: profile.nickname,
     provider: ProviderStatus.naver
    };
  }
};