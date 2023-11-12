import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Board } from './board.entity'
import { User } from '../auth/user.entity'
import { Image } from './Images/images.entity' 
import { CreateBoardDto } from './dto/create-board.dto'
import { BoardStatus } from './board-status.enum'

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(dataSource: DataSource) {
    super(Board, dataSource.createEntityManager())
  }

  async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    const { title, content} = createBoardDto
    const { userId, email, nickname } = user

    try {
      // board 테이블 생성
      const board = this.create({
        user: { userId }, // board.entity.ts의 user 컬럼 때문에
        email,
        nickname,
        title,
        content,
        status: BoardStatus.PUBLIC
      })

      await this.save(board)
      return board
    } catch (err) {
      console.error(err)
      throw new Error() // 나중에 맞는 에러 객체로 바꿔주기
    }
  }
};