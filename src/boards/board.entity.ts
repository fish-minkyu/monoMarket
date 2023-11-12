import { BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Entity, OneToMany } from "typeorm";
import { BoardStatus } from './board-status.enum'
import { User } from '../auth/user.entity'
import { Image } from './Images/image.entity'

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  boardId: number

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

  @ManyToOne(() => User, user => user.boards)
  @JoinColumn({ name: 'userId'}) //* Q. @JoinColumn의 역할은? 
  user: User //* Q. @JoinColumn() 없애고 userId: number하면 안되나

  @OneToMany(() => Image, (image) => image.board)
  images: Image[]
};