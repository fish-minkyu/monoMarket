import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique, OneToOne } from "typeorm"
import { RefreshToken } from './refreshToken.entity'

@Entity()
@Unique(['email', 'nickname'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number

  @Column()
  email: string

  @Column({ nullable: false })
  nickname: string

  @Column()
  password: string

  @OneToOne(type => RefreshToken, refreshToken => refreshToken.userId, { eager: false })
  refreshToken: RefreshToken
}