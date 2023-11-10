import { BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BoardStatus } from './board-status.enum'

export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  boardId: number

  @Column()
  userId: number

  @Column()
  email: string

  @Column()
  nickname: string

  @Column()
  title: string

  @Column()
  content: string

  @Column()
  status: BoardStatus

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date
};