import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { InternalServerErrorException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as multerS3 from 'multer-s3' //ES6 모듈을 사용하는 경우 이렇게 import를 해줘야 한다.
import * as dotenv from 'dotenv'
import { dot } from "node:test/reporters";
dotenv.config()

// s3 옵션 객체 
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
})

// multer-s3 업로드
export const multerOptionsFactory = (): MulterOptions => {
  return {
    storage: multerS3({
      s3: s3,
      bucket: 'mono-market-image',
      // acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {

        // 파일이 이미지가 아닌 경우, 에러 처리
        if (!file.mimetype.startsWith('image/')) throw new Error('이미지 형식만 저장할 수 있습니다.')
        cb(null, `images/${Date.now().toString()}_${file.originalname.toString()}`)
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5mb
  };
};

// multer-s3 삭제 
export async function deleteS3(imageKey: string): Promise<{ message: string}> {
  const params = {
    Bucket: 'mono-market-image',
    Key: imageKey
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command)

    return { message: '이미지 삭제 성공!'}
  } catch (err) {
    console.error(err)
    throw new InternalServerErrorException()
  }
};
