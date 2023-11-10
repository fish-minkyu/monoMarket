import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { AuthModule } from 'src/auth/auth.module';
import { BoardRepository } from './board.repository';

@Module({
  imports: [AuthModule],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    BoardRepository
  ]
})
export class BoardsModule {}
