import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { LoginService } from './login.service';
import { JwtKakaoStrategy } from 'src/auth/passport/jwtKakaoStrategy';
import { JwtGoogleStrategy } from './passport/jwtGoogleStrategy';
import { JwtNaverStrategy } from './passport/jwtNaverStraregy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    AuthRepository,
    LoginService, 
    JwtStrategy,
    JwtKakaoStrategy,
    JwtGoogleStrategy,
    JwtNaverStrategy,
  ],
  //* exports를 써주는 이유는? 
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
