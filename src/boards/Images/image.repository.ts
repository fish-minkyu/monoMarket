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
  async createImage(files: Express.MulterS3.File[]): Promise<Image[]> {
    const imagePromises = files.map((image) => {
      const newImage = Image.create({
        url: image.location,
        boardStatus: BoardStatus.PUBLIC
      })

      return newImage.save()
    })
    
    const images = await Promise.all(imagePromises)

    console.log(images)
    return images
  };
};

// [
//   Image {
//     url: 'https://mono-market-image.s3.ap-northeast-2.amazonaws.com/images/1699787350537_DB.png',
//     boardStatus: 'PUBLIC',
//     imageId: 5,
//     createdAt: 2023-11-12T11:09:11.221Z,
//     updatedAt: 2023-11-12T11:09:11.221Z
//   },
//   Image {
//     url: 'https://mono-market-image.s3.ap-northeast-2.amazonaws.com/images/1699787350537_clip.png',
//     boardStatus: 'PUBLIC',
//     imageId: 6,
//     createdAt: 2023-11-12T11:09:11.221Z,
//     updatedAt: 2023-11-12T11:09:11.221Z
//   }

// files [
//   {
//     fieldname: 'file',
//     originalname: 'DB.png',
//     encoding: '7bit',
//     mimetype: 'image/png',
//     size: 37435,
//     bucket: 'mono-market-image',
//     key: 'images/1699783883309_DB.png',
//     acl: 'private',
//     contentType: 'image/png',
//     contentDisposition: null,
//     contentEncoding: null,
//     storageClass: 'STANDARD',
//     serverSideEncryption: null,
//     metadata: undefined,
//     location: 'https://mono-market-image.s3.ap-northeast-2.amazonaws.com/images/1699783883309_DB.png',
//     etag: '"9647c4492f9da7906fe39cdcb78b1e8d"',
//     versionId: undefined
//   },
//   {
//     fieldname: 'file',
//     originalname: 'clip.png',
//     encoding: '7bit',
//     mimetype: 'image/png',
//     size: 33520,
//     bucket: 'mono-market-image',
//     key: 'images/1699783883310_clip.png',
//     acl: 'private',
//     contentType: 'image/png',
//     contentDisposition: null,
//     contentEncoding: null,
//     storageClass: 'STANDARD',
//     serverSideEncryption: null,
//     metadata: undefined,
//     location: 'https://mono-market-image.s3.ap-northeast-2.amazonaws.com/images/1699783883310_clip.png',
//     etag: '"1295503cc843301a428c8ae246eab67d"',
//     versionId: undefined
//   }
// ]