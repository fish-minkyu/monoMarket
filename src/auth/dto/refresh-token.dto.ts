import { IsNotEmpty } from "class-validator";

// refreshToken을 이용해 accessToken을 재발급할 때 사용
export class refreshTokenDto {
  @IsNotEmpty()
  refreshToken: string
}