import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from "typeorm";
import { Image } from './image.entity'
import { BoardStatus } from "../board-status.enum";

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
    const imagePromises = files.map((image) => {
      const newImage = Image.create({
        url: image.location,
        board: { boardId },
        boardStatus: BoardStatus.PUBLIC
      })

      return newImage.save()
    })
    
    const images = await Promise.all(imagePromises)

    // console.log(images)
    return images
  };
};
