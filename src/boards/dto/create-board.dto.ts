import { IsNotEmpty, IsString, IsNumber } from "class-validator"

// board 생성할 때 사용
export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  content?: string
};