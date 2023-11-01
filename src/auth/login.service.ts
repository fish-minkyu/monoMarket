import { InjectRepository } from '@nestjs/typeorm'
import { AuthRepository } from "./auth.repository";
import * as bcrypt from 'bcryptjs'
import { User } from'./user.entity'
import { BadRequestException } from '@nestjs/common';

export class LoginService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository
  ) {}

  async getCurrnetHashedRefreshToken(refreshToken: string) {
    const salt = await bcrypt.genSalt()
    const currentRefreshToken = await bcrypt.hash(refreshToken, salt)
    return currentRefreshToken
  };

  async getCurrentRefreshTokenExp(): Promise<Date> {
    const currentDate = new Date();
    // Date 형식으로 DB에 저장하기 위해 문자열을 숫자 타입으로 변환(parseInt)
    const currentRefreshTokenExp = new Date(currentDate.getTime() + parseInt('1800000'))
    return currentRefreshTokenExp
  }

  // refreshToken의 값과 만료시간을 User 테이블에 저장
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentRefreshToken = await this.getCurrnetHashedRefreshToken(refreshToken)
    const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp()
    await this.authRepository.update(userId, {
      currentRefreshToken: currentRefreshToken,
      currentRefreshTokenExp: currentRefreshTokenExp
    })
  };

  // DB에 저장된 user와 req에 들어온 refreshToken과 일치하는지 확인 -> 일치하면 user 객체 반환
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User> {
    try {
      // findOneBy: 해당 값이 없으면 null 반환
      const user: User = await this.authRepository.findOneBy({ userId })

      if (!user.currentRefreshToken) return null

      // 유저 테이블 내에 정의된 암호화된 refresh_token값과 요청 시 body에 담아준 refresh_token값 비교
      const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentRefreshToken)
      if (isRefreshTokenMatching) return user

    } catch (err) {
      throw new BadRequestException('알 수 없는 오류입니다.')
    }
  };

  // refreshToken null값으로 변경
  async removeRefreshToken(userId: number): Promise<any> {
    return await this.authRepository.update(userId, {
      currentRefreshToken: null,
      currentRefreshTokenExp: null
    })
  };
};