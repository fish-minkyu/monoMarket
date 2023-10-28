import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './authRepository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SecretKey',
      signOptions: {
        expiresIn: 36000
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository]
})
export class AuthModule {}
