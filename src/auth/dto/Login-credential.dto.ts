import { IsString } from 'class-validator'

// 로그인할 때 사용
export class LoginCredentialsDto {
  @IsString()
  email: string

  @IsString()
  password: string
}