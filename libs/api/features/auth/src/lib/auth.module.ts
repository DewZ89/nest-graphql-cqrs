import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { CqrsModule } from '@nestjs/cqrs'
import { PassportModule } from '@nestjs/passport'
import { AuthResolver } from './auth.resolver'
import { HANDLERS as COMMANDS_HANDLERS } from './commands'
import { HANDLERS as QUERY_HANDLERS } from './queries'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '@blog/api/features/users'

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.register({ secret: 'exed', signOptions: { expiresIn: '30m' } }),
    UsersModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AuthResolver,
    ...COMMANDS_HANDLERS,
    ...QUERY_HANDLERS,
  ],
  exports: [],
})
export class AuthModule {}
