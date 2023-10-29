import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { LoginCredentialsDto } from './dto/Login-credential.dto'

@Controller('auth')
export class AuthController {
  // 의존성 주입
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp( @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto ): Promise<void> {
    return this.authService.signUp(authCredentialsDto)
  };
s
  @Post('login')
  logIn(@Body(ValidationPipe) loginCredentialsDto: LoginCredentialsDto): Promise<{accessToken: string}> {
    return this.authService.logIn(loginCredentialsDto)
  }
}
