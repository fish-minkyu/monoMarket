import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

export class refreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  refreshId: number

  @Column()
  userId: string
}