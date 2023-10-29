import { Entity, BaseEntity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from './user.entity'

@Entity()
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  refreshId: number

  @Column()
  refreshToken: string

  @OneToOne(type => User, user => user.userId, { eager: false })
  @JoinColumn()
  userId: string
}