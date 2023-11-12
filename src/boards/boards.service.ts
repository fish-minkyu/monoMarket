import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/auth/user.entity';
import { Board } from './board.entity'
import { BoardStatus } from './board-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageRepository } from '../boards/Images/image.repository'
import { Image } from './Images/image.entity';

@Injectable()
export class BoardsService {
  // 의존성 주입
  constructor(
    @InjectRepository(BoardRepository) //*Q @InjectRepository(BoardRepository) 없어도 잘 되는데 이거 왜 쓰지?
    private boardRepository: BoardRepository,
    @InjectRepository(ImageRepository)
    private imageRepository: ImageRepository
    ) {}

  // 게시글 생성 (완료)
  async createBoard(
    createBoardDto: CreateBoardDto, 
    user: User,
    files: Express.MulterS3.File[]
    ): Promise<{ board: Board; images: Image[]}> { // 반환 타입을 2개 동시에 쓰는 법, 반환 타입을 명시해줘야 반환값이 제대로 뜸
    const board = await this.boardRepository.createBoard(createBoardDto, user) // await 키워드를 쓰지 않으면, 반환 타입 지정에 문제가 생긴다.
    const images = await this.imageRepository.createImage(files)

    return { board, images }
  };

  // 게시글 전체 보기
  async getAllBoards(): Promise<Board[]> {
    try {
      const query = this.boardRepository.createQueryBuilder('board')
      query.where('board.status = :status', { status: BoardStatus.PUBLIC })
      const boards = await query.getMany()
  
      return boards
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException() 
    }
  };

  // 게시글 상세 보기
  async getBoardById(boardId: number): Promise<Board> {
      const board = await this.boardRepository.findOne({ where: { boardId }, relations: ['user'] })

      // boardId가 없는 id일 경우, 에러 처리
      if (!board) {
        throw new NotFoundException( `게시글 ${boardId}번은 없는 게시글입니다.` )
      }

      return board
  };

    // 게시글 내용 수정
    async updateBoard(
      user: User,
      boardId: number,
      createBoardDto: CreateBoardDto
    ): Promise<Board> {
      const { title, content } = createBoardDto
  
      try {
        const board = await this.getBoardById(boardId)
  
        // 게시글 수정 권한이 없을 때, 에러 처리
        if (board.user.userId !== user.userId) {
          throw new UnauthorizedException( `게시글 ${board.boardId}번은 수정 권한이 없습니다.` )
      }
  
        board.title = title
        board.content = content
        await this.boardRepository.save(board)
  
        return board
      } catch (err) {
        console.error(err)
        if (err instanceof UnauthorizedException) throw new UnauthorizedException(err.message)
        if (err instanceof NotFoundException) throw new NotFoundException(err.message)
        if (err instanceof InternalServerErrorException) throw new InternalServerErrorException(err.message)
      }
    };

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
        if (err instanceof UnauthorizedException) throw new UnauthorizedException(err.message)
        if (err instanceof NotFoundException) throw new NotFoundException(err.message)
        if (err instanceof InternalServerErrorException) throw new InternalServerErrorException(err.message)
      }
  };

  // 게시글 삭제
  async deleteBoard(
    boardId: number, 
    userId: number)
    : Promise<{ message: string }> {
    try {
      const board = await this.getBoardById(boardId)

    // 게시글 삭제 권한이 없을 때 Error
    if (board.user.userId !== userId) {
      throw new UnauthorizedException( '삭제 권한이 없습니다.' )
    }

    const result = await this.boardRepository.delete({ boardId, user: { userId } })

    return { message: '삭제 성공'}
    } catch (err) {
      console.error(err)
      if (err instanceof UnauthorizedException) throw new UnauthorizedException(err.message)
      if (err instanceof NotFoundException) throw new NotFoundException(err.message) // 해당 게시글이 없을 때 에러 메시지를 알아서 보내준다.
      if (err instanceof InternalServerErrorException) throw new InternalServerErrorException(err.message)
    }
  };
};
