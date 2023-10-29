import { IsEmail, IsString } from 'class-validator'

export class AuthCredentialsDto {
  @IsString()
  @IsEmail()
  email: string

  @IsString()
  nickname: string

  @IsString()
  password: string

  @IsString()
  confirm?: string
}