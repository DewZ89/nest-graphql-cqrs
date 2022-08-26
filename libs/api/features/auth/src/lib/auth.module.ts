import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { CqrsModule } from '@nestjs/cqrs'
import { PassportModule } from '@nestjs/passport'
import { AuthResolver } from './auth.resolver'
import { HANDLERS as COMMANDS_HANDLERS } from './commands'

@Module({
  imports: [CqrsModule, PassportModule],
  providers: [AuthService, LocalStrategy, AuthResolver, ...COMMANDS_HANDLERS],
  exports: [],
})
export class AuthModule {}
