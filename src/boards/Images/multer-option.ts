import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { InternalServerErrorException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as multerS3 from 'multer-s3' //* ES6 모듈을 사용하는 경우 이렇게 import를 해줘야 한다. import multerS3 from 'multer-s3'를 하게 되면 contentType이 null값이 와 에러를 일으킨다.
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

// multer-s3 업로드 (완료)
export const multerOptionsFactory = (): MulterOptions => {
  return {
    storage: multerS3({
      s3: s3,
      bucket: 'mono-market-image',
      // acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {

        // 파일이 이미지가 아닌 경우, 에러 처리 //* 만약, 사용자가 image 파일 외 다른 형식을 올릴 경우를 대비하여 설정했다.
        if (!file.mimetype.startsWith('image/')) throw new Error('이미지 형식만 저장할 수 있습니다.')
        cb(null, `images/${Date.now().toString()}_${file.originalname.toString()}`)
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5mb
  };
};

// multer-s3 삭제 (완료)
export async function deleteS3(imageKey: string) {
  const params = {
    Bucket: 'mono-market-image',
    Key: imageKey // 삭제할 이미지의 키 'images/1691343931840_multer.png'
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command)
  } catch (err) {
    console.error(err)
    throw new InternalServerErrorException()
  }
};
