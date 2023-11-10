// 커스텀 데코레이터
// AuthGuard에 의해 인증된 사용자 정보를 쉽게 가져올 수 있도록 돕는 역할
import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from './user.entity'
// createParamDecorator( 1. data, 2. ctx: ExecutionContext)
// : 커스텀 데코레이터를 생성하는 함수, 인자로 데코레이터의 로직을 담은 함수를 받는다.
// 1. data
// : 데코레이터가 사용될 때 전달되는 데이터
// 2. ctx: ExecutionContext
// : 현재 실행 컨텍스트(ExecutionContext)
export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest()
  return req.user
});