import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm"
import { ProviderStatus } from './provider-status.enum'
import { Board } from '../boards/board.entity'

@Entity()
// @Unique(['email', 'nickname'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number

  @Column({ type: 'varchar', length: 50, comment: '유저 이메일' })
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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[]
};