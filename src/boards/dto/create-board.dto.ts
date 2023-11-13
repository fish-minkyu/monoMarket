import { IsNotEmpty, IsString, IsOptional } from "class-validator"

// board 생성할 때 사용
export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  content?: string
};