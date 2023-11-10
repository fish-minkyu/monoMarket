import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/auth/user.entity';
import { Board } from './board.entity'
import { BoardStatus } from './board-status.enum';

@Injectable()
export class BoardsService {
  // 의존성 주입
  constructor(private boardRepository: BoardRepository) {}

  // 게시글 생성
  async createBoard(
    createBoardDto: CreateBoardDto, 
    user: User
    ): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user)
  };

  // 게시글 전체 보기
  async getAllBoards(): Promise<Board[]> {
    try {
      const query = this.boardRepository.createQueryBuilder('board')
      query.where('board.status = :status', { status: BoardStatus.PUBLIC })
      const boards = await query.getMany()
  
      // const boards = await this.createQueryBuilder('board')
      // .where('board.status = :status', { status: 'PUBLIC' })
      // .getMany();
  
      return boards
    } catch (err) {
      console.error(err)
      throw new Error() //? 적절한 에러 객체 찾아서 주기
    }
  };

  // 게시글 상세 보기
  async getBoardById(boardId: number): Promise<Board> {
      return this.boardRepository.findOne({ where: { boardId }})
  }

  // 게시글 상태 수정하기
  async updateBoardStatus(
    boardId: number, 
    status: BoardStatus
    ): Promise<Board> {
      try {
        const board = await this.getBoardById(boardId)

        board.status = status
        await this.boardRepository.save(board)

        return board
      } catch (err) {
        console.error(err)
        throw new Error() //? 적절한 에러 객체 찾아서 주기
      }
  }

  // 게시글 내용 수정
  async updateBoard(
    boardId: number,
    createBoardDto: CreateBoardDto
  ): Promise<Board> {
    const { title, content } = createBoardDto

    try {
      const board = await this.getBoardById(boardId)

      board.title = title
      board.content = content
      await this.boardRepository.save(board)

      return board
    } catch (err) {
      console.error(err)
      throw new Error() //? 적절한 에러 객체 찾아서 주기
    }
  }

  // 게시글 삭제
  async deleteBoard(
    boardId: number, 
    userId: number)
    : Promise<{ message: string }> {
    const result = await this.boardRepository.delete({ boardId, userId })

    if (result.affected === 0) {
      throw new NotFoundException(`게시글 ${boardId}을 찾을 수 없습니다.`)
    } else {
      return { message: '삭제 성공'}
    }
  }
};
