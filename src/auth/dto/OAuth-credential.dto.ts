import { IsString } from 'class-validator'
import { ProviderStatus } from '../provider-status.enum'

export class OAuthCredentialDto {
  @IsString()
  email: string

  @IsString()
  nickname: string

  @IsString()
  provider: ProviderStatus
};