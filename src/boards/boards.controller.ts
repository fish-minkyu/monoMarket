import { Controller, Post, Body, Req, Res, UseGuards, Get, Param, Patch, ParseIntPipe, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../auth/user.entity'
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';
import { BoardStatusValidationPipe } from './pipes/board-state-validation.pipe'
import { FilesInterceptor } from '@nestjs/platform-express';

  // user User {
  //   userId: 3,
  //   email: 'e951219@naver.com',
  //   nickname: '어민규',
  //   password: null,
  //   provider: 'kakao',
  //   currentRefreshToken: null,
  //   currentRefreshTokenExp: null,
  //   createdAt: 2023-11-10T12:21:28.130Z,
  //   updatedAt: 2023-11-10T12:21:28.130Z
  // }
@Controller('boards')
export class BoardsController {
  // 의존성 주입
  constructor(private boardsService: BoardsService) {}

  // 게시글 Create
  @Post()
  @UseInterceptors(FilesInterceptor('file', 10))
  @UseGuards(AuthGuard())
  async createBoard(
    @GetUser() user: User,
    @Body() createBoardDto: CreateBoardDto,
    @UploadedFiles() files,
    @Req() req: Request
    ): Promise<any> {
      console.log('user', user)
      console.log('files', files)
      return this.boardsService.createBoard(createBoardDto, user, files)
  };

  // 게시글 전체 Get
  @Get()
  async getAllBoards(): Promise<Board[]> {
    return this.boardsService.getAllBoards()
  };

  // 게시글 상세보기 Get
  @Get('/:boardId')
  async getBoardById(@Param('boardId') boardId: number): Promise<Board> {
    return this.boardsService.getBoardById(boardId)
  };

  // 게시글 내용 수정하기
  @Patch('/:boardId')
  @UseGuards(AuthGuard())
  async updateBoard(
    @GetUser() user: User,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createBoardDto: CreateBoardDto
  ): Promise<Board> {
    return this.boardsService.updateBoard(user, boardId, createBoardDto)
  };

  // 게시글 상태 수정하기 // 인스타그램과 같다고 생각
  @Patch('/:boardId/status')
  @UseGuards(AuthGuard())
  async updateBoardStatus(
    @Param('boardId', ParseIntPipe) boardId: number,
    //? validationPipe 주기
    @Body('status', BoardStatusValidationPipe) status: BoardStatus
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(boardId, status)
  };

  // 게시글 삭제
  @Delete('/:boardId')
  @UseGuards(AuthGuard())
  async deleteBoard(
    @GetUser() user: User,
    @Param('boardId', ParseIntPipe) boardId: number)
    : Promise<{ message: string }> {
    return this.boardsService.deleteBoard(boardId, user.userId)
  };
};
