import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

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
  confirm?: string
}