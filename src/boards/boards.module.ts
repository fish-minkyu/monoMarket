import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { AuthModule } from 'src/auth/auth.module';
import { BoardRepository } from './board.repository';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from './Images/multer-option';
import { ImageRepository } from './Images/image.repository';

@Module({
  imports: [
    AuthModule,
    MulterModule.registerAsync({
      useFactory: multerOptionsFactory
    })
  ],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    BoardRepository,
    ImageRepository
  ]
})
export class BoardsModule {}
