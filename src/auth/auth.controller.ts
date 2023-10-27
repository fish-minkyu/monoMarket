import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  // 의존성 주입
  constructor(private authService: AuthService) {}

  
}
