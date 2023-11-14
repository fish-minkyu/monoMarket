import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from "typeorm";
import { Image } from './image.entity'
import { BoardStatus } from "../board-status.enum";
import { deleteS3 } from '../Images/multer-option'
import { Board } from '../board.entity';

// TypeORM은 repository 하나 당 하나의 entity만 연결할 수 있다.
@Injectable()
export class ImageRepository extends Repository<Image> {
  constructor(dataSource: DataSource) {
    super(Image, dataSource.createEntityManager())
  }

  // 이미지 테이블 생성
  async createImage(
    files: Express.MulterS3.File[],
    boardId: number
    ): Promise<Image[]> {
    // Promise.all로 S3버킷에 이미지 생성
    const imagePromises = files.map((image) => {
      const newImage = Image.create({
        url: image.location,
        board: { boardId },
        boardStatus: BoardStatus.PUBLIC
      })

      return newImage.save()
    })
    
    const images = await Promise.all(imagePromises)

    return images
  };

  // S3 버킷 삭제
  async deleteS3(images: Image[]) {
    // Promise.all로 S3버킷에 이미지 삭제
    const s3DeletePromise = images.map( image => {
      const imagePath = new URL(image.url).pathname.substring(1)
      return deleteS3(imagePath)
    })

    await Promise.all(s3DeletePromise)
  };
};