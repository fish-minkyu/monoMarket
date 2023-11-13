import { IsString } from 'class-validator'

//* 코드를 직관적으로 보여주고자 LoginCredentialsDto을 만들었다.
// 로그인할 때 사용
export class LoginCredentialsDto {
  @IsString()
  email: string

  @IsString()
  password: string
}