import { IsEmail, IsEmpty, IsNotEmpty, IsString } from 'class-validator'

// 회원가입할 때 사용
export class AuthCredentialsDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  nickname: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  confirm: string
}