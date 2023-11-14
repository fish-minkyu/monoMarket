import { Controller, Post, Body, Req, Res, UseGuards, Get, Param, Patch, ParseIntPipe, Delete, UseInterceptors, UploadedFiles, ValidationPipe } from '@nestjs/common';
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

@Controller('boards')
export class BoardsController {
  // 의존성 주입
  constructor(private boardsService: BoardsService) {}

  // 게시글 Create (완료)
  @Post()
  @UseInterceptors(FilesInterceptor('file', 10)) //* 이건 인터셉터일까 아님 데코레이터일까?
  @UseGuards(AuthGuard())
  async createBoard(
    @GetUser() user: User,
    @Body(ValidationPipe) createBoardDto: CreateBoardDto,
    @UploadedFiles() files: Express.MulterS3.File[],
    @Req() req: Request
    ): Promise<any> {
      return this.boardsService.createBoard(createBoardDto, user, files)
  };

  // 게시글 전체 Get (완료)
  @Get()
  async getAllBoards(): Promise<Board[]> {
    return this.boardsService.getAllBoards()
  };

  // 게시글 상세보기 Get (완료)
  @Get(':boardId')
  async getBoardById(@Param('boardId') boardId: number): Promise<Board> {
    return this.boardsService.getBoardById(boardId)
  };

  // 게시글 내용 수정하기
  @Patch(':boardId')
  @UseInterceptors(FilesInterceptor('file', 10))
  @UseGuards(AuthGuard())
  async updateBoard(
    @GetUser() user: User,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body(ValidationPipe) createBoardDto: CreateBoardDto,
    @UploadedFiles() files: Express.MulterS3.File[]
  ): Promise<Board> {
    return this.boardsService.updateBoard(user, boardId, createBoardDto, files)
  };

  // 게시글 상태 수정하기 // 인스타그램과 같다고 생각
  @Patch(':boardId/status')
  @UseGuards(AuthGuard())
  async updateBoardStatus(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(boardId, status)
  };

  // 게시글 삭제
  @Delete(':boardId')
  @UseGuards(AuthGuard())
  async deleteBoard(
    @GetUser() user: User,
    @Param('boardId', ParseIntPipe) boardId: number)
    : Promise<{ message: string }> {
    return this.boardsService.deleteBoard(boardId, user.userId)
  };
};
