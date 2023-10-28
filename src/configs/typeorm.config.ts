import { TypeOrmModuleOptions } from "@nestjs/typeorm"

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432, // postgfres 기본 포트
  username: 'postgres',
  password: 'postgres',
  database: 'board-app',
  entities: [__dirname + '/../**/*.entitiy.{js,ts}'],
  synchronize: true
}