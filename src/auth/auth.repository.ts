import { Repository, DataSource } from 'typeorm'
import { User } from './user.entity'
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { AuthCredentialsDto } from './dto/auth-credential.dto'
import * as bcrypt from 'bcryptjs'
import { ProviderStatus } from './provider-status.enum'
import { OAuthCredentialDto } from './dto/OAuth-credential.dto'


@Injectable()
export class AuthRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  // 로컬 회원가입
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, nickname, password } = authCredentialsDto

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = this.create({ email, nickname, password: hashedPassword }) // user객체를 메모리 상에 생성 (DB에 저장하는 것이 아님)

    try {
      await this.save(user)
      console.log('authRepository', '회원가입 성공')
    } catch (err) {
      // 23505
      // : PostgreSQL DB에서 나타나는 데이터베이스 무결성 제약 조건을 위반할 때 발생하는 코드
      // Ex. DB에 중복된 유니크 제약 조건을 가진 열에 대해 중복값을 삽입하려고 할 때 발생
      if (err.code === '23505') { 
        // ConflictException
        // : NestJS 프레임워크에서 제공중인 예외 클래스 중 하나, 데이터 충돌과 관련된 상황에서 사용이 된다.
        throw new ConflictException('Existing email');
      } else {
        throw new InternalServerErrorException();
      }
    }
  };

  // 회원탈퇴
  async deleteUser(user: any): Promise<void> {
    await this.delete(user)
  };

  async createOAuth(email: string, nickname: string, provider: ProviderStatus): Promise<User> {
    
    try {
      const user = this.create({ email, nickname, provider })
      await this.save(user)

      return user
    } catch (err) {
      console.log('repository', err)
      throw new InternalServerErrorException();
    }
  };
};