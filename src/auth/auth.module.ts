import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

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
  providers: [AuthService, AuthRepository]
})
export class AuthModule {}
