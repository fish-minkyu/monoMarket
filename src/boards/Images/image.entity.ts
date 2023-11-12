import { BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Entity } from "typeorm";
import { Board } from "../board.entity";
import { BoardStatus } from '../board-status.enum'

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  imageId: number

  @Column({ type: 'varchar', length: 3000, comment: '이미지 url' })
  url: string

  @Column() // 하나의 관계에는 한 개의 외래키만 지정해야 한다.
  boardStatus: BoardStatus

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @ManyToOne(() => Board, (board) => board.images)
  @JoinColumn({ name: 'boardId'})
  board: Board
};