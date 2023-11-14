import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/auth/user.entity';
import { Board } from './board.entity'
import { BoardStatus } from './board-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageRepository } from '../boards/Images/image.repository'
import { Image } from './Images/image.entity';
import { deleteS3 } from './Images/multer-option'
import { contains } from 'class-validator';

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
    ): Promise<{ board: Board; images?: Image[] }> { // 반환 타입을 2개 동시에 쓰는 법, 반환 타입을 명시해줘야 반환값이 제대로 뜸
    const board = await this.boardRepository.createBoard(createBoardDto, user) // await 키워드를 쓰지 않으면, 반환 타입 지정에 문제가 생긴다.
    console.log('board', board)
    
    // files가 있으면 return { board, images } 
    if (files) {
      const images = await this.imageRepository.createImage(files, board.boardId)
      console.log('createImage', images)
      return { board, images }
    }
    
    // files가 없으면 return { board }
    return { board }
  };

  // 게시글 전체 보기 (완료)
  async getAllBoards(): Promise<Board[]> {
    try {
      const query = this.boardRepository.createQueryBuilder('board')
      query.where('board.status = :status', { status: BoardStatus.PUBLIC })
      
      // Image 테이블과 Board 테이블 조인
      query.leftJoinAndSelect('board.images', 'image') 
  
      const boards = await query.getMany()
  
      return boards
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException() 
    }
  };

  // 게시글 상세 보기 (완료)
  async getBoardById(boardId: number): Promise<Board> {
      const board = await this.boardRepository.findOne({ 
        where: { boardId, status: BoardStatus.PUBLIC }, 
        relations: ['user', 'images'] }) //*

      // boardId가 없는 id일 경우, 에러 처리
      if (!board) {
        throw new NotFoundException( `게시글 ${boardId}번은 없는 게시글입니다.` )
      }

      return board
  };

  // 게시글 내용 수정 (완료)
  async updateBoard(
    user: User,
    boardId: number,
    createBoardDto: CreateBoardDto,
    files: Express.MulterS3.File[]
  ): Promise<Board> {
    const { title, content } = createBoardDto

    try {
      const board = await this.getBoardById(boardId)

      // 게시글 수정 권한이 없을 때, 에러 처리
      if (board.user.userId !== user.userId) {
        throw new UnauthorizedException( `게시글 ${board.boardId}번은 수정 권한이 없습니다.` )
    };

    console.log('origin', board)
    if (files) {
       // 기존 이미지 삭제 & S3 버킷 삭제
      await this.imageRepository.delete({ board: { boardId } });
      await this.imageRepository.deleteS3(board['images']);

      // 새 이미지 생성
      const newImages = await this.imageRepository.createImage(files, board.boardId);
      console.log('newImages', newImages)

      // board 객체 다시 로드
      const updatedBoard = await this.getBoardById(boardId);

      updatedBoard.title = title
      updatedBoard.content = content
      console.log('before', updatedBoard)
      // 게시글 변경사항 DB에 저장
      await this.boardRepository.save(updatedBoard)
      console.log('after', updatedBoard)
      
      return updatedBoard
    }
      // title 및 content 수정
      board.title = title
      board.content = content
      console.log('before', board)
      // 게시글 변경사항 DB에 저장
      await this.boardRepository.save(board)
      console.log('after', board)
      
      return board
    } catch (err) {
      console.error(err)
      if (err instanceof UnauthorizedException) throw new UnauthorizedException(err.message)
      if (err instanceof NotFoundException) throw new NotFoundException(err.message)
      if (err instanceof InternalServerErrorException) throw new InternalServerErrorException(err.message)
    }
  };

  // 게시글 상태 수정하기 (완료)
  async updateBoardStatus(
    boardId: number, 
    status: BoardStatus
    ): Promise<Board> {
      try {
        const board = await this.getBoardById(boardId)

        // 이미지도 있다면 변경
        if (board.images.length) {
          board.images.map( image => {
            return image.boardStatus = status
          })
        }

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

  // 게시글 삭제 (완료)
  async deleteBoard(
    boardId: number, 
    userId: number)
    : Promise<{ message: string }> {
    try {
      // 해당 게시글 조회
      const board = await this.getBoardById(boardId)

    // 게시글 삭제 권한이 없을 때 Error
    if (board.user.userId !== userId) {
      throw new UnauthorizedException( '삭제 권한이 없습니다.' )
    }
    // 이미지 데이터가 있을 시, 이미지 테이블 & S3버킷에서 삭제
    if (board.images.length) {
      // Image 테이블 데이터 삭제 //* board보다 image를 먼저 삭제하는 이유는 외래 키 제약조건에 따라 board가 삭제되면 참조하는 image가 여전히 존재하므로 DB에서 오류가 발생하기 때문이다.
      await this.imageRepository.delete({ board: { boardId } })

      // 게시글 삭제
      await this.boardRepository.delete({ boardId, user: { userId } })

      // S3 버킷 삭제
      const images = board['images']
      await this.imageRepository.deleteS3(images)
    } else {
      // 이미지가 없을 시, 게시글만 삭제
      await this.boardRepository.delete({ boardId, user: { userId } })
    }

    return { message: '삭제되었습니다.'}
    } catch (err) {
      console.error(err)
      if (err instanceof UnauthorizedException) throw new UnauthorizedException(err.message)
      if (err instanceof NotFoundException) throw new NotFoundException(err.message) // 해당 게시글이 없을 때 에러 메시지를 알아서 보내준다.
      if (err instanceof InternalServerErrorException) throw new InternalServerErrorException(err.message)
    }
  };
};
