import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { CqrsModule } from '@nestjs/cqrs'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [CqrsModule, PassportModule],
  providers: [AuthService, LocalStrategy],
  exports: [],
})
export class AuthModule {}
