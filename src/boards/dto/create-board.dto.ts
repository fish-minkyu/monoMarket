import { IsNotEmpty, IsString, IsNumber } from "class-validator"

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  content?: string
};