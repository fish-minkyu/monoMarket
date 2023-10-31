import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm"

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

  @Column({ nullable: true })
  currentRefreshToken: string

  @Column({ type: 'datetime', nullable: true })
  currentRefreshTokenExp: Date
}