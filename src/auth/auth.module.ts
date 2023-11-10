import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { LoginService } from './login.service';
import { jwtKakaoStrategy } from 'src/auth/passport/jwtKakaoStrategy';
import { JwtGoogleStrategy } from './passport/jwtGoogleStrategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'SecretKey',
      signOptions: {
        expiresIn: 36000 
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    AuthRepository,
    LoginService, 
    JwtStrategy,
    jwtKakaoStrategy,
    JwtGoogleStrategy
  ],
  //* exports를 써주는 이유는? 
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
