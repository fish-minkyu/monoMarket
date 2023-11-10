import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm"
import { ProviderStatus } from './provider-status.enum'

@Entity()
// @Unique(['email', 'nickname'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number

  @Column()
  email: string

  @Column({ nullable: false })
  nickname: string

  @Column({ nullable: true })
  password: string

  @Column({ default: ProviderStatus.local }) // default 옵션 사용
  provider: ProviderStatus

  @Column({ nullable: true })
  currentRefreshToken: string

  @Column({ type: 'timestamp', nullable: true })
  currentRefreshTokenExp: Date

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date
}