import { BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Entity } from "typeorm";
import { Board } from "../board.entity";

export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  imageId: number

  @Column({ type: 'varchar', length: 3000, comment: '이미지 url' })
  url: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @ManyToOne(() => Board, (board) => board.images)
  @JoinColumn({ name: 'boardId'})
  board: Board
};