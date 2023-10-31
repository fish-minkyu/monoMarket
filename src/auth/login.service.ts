import { InjectRepository } from '@nestjs/typeorm'
import { AuthRepository } from "./auth.repository";
import * as bcrypt from 'bcryptjs'

export class LoginService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository
  ) {}

  async getCurrnetHashedRefreshToken(refreshToken: string) {
    const salt = bcrypt.genSalt()
    const currentRefreshToken = await bcrypt.hash(refreshToken, salt)
    return currentRefreshToken
  };

  async getCurrentRefreshTokenExp(): Promise<Date> {
    const currentDate = new Date();
    // Date 형식으로 DB에 저장하기 위해 문자열을 숫자 타입으로 변환(parseInt)
    const currentRefreshTokenExp = new Date(currentDate.getTime() + parseInt('1800000'))
    return currentRefreshTokenExp
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentRefreshToken = await this.getCurrnetHashedRefreshToken(refreshToken)
    const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp()
    await this.authRepository.update(userId, {
      currentRefreshToken: currentRefreshToken,
      currentRefreshTokenExp: currentRefreshTokenExp
    })
  };
};