
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthRepository } from '../auth.repository';
import { User } from '../user.entity'
import { ProviderStatus } from '../provider-status.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  @InjectRepository(AuthRepository)
  private authRepository: AuthRepository
  ) {
    super({
      secretOrKey: 'SecretKey',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  };

  async validate(payload) {
    const { email, provider } = payload
    
    const user: User = await this.authRepository.findOne({ where: { email, provider } })

    if (!user) {
      console.error('Seebal')
      throw new UnauthorizedException()
    }
    console.log(user)
    return user
  };
};