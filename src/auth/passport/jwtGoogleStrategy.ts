import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { ProviderStatus } from "../provider-status.enum";

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  //UseGuards의 이름과 동일해야함
  constructor() {
    //constructor에서 성공하면 아래의 validate로 넘겨주고, 만약 실패하면 멈춰지고 에러 반환
    super({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_URL,
      scope: ['email', 'profile'],
    });
  }
  
  validate(accessToken, refreshToken, profile) {
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile);
    // console.log('email', profile.emails[0].value)

    return {
      email: profile?.emails[0].value,
      nickname: profile.displayName,
      provider: ProviderStatus.google
    };
  }
}