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
import { JwtStrategy } from './strategies/jwt.strategy'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './auth.module-definition'
import { AuthModuleOptions } from './types/auth-module-options.interface'

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (options: AuthModuleOptions) => {
        return {
          secret: options.jwtSecretKey,
          signOptions: {
            expiresIn: '1h',
          },
        }
      },
      inject: [MODULE_OPTIONS_TOKEN],
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AuthResolver,
    ...COMMANDS_HANDLERS,
    ...QUERY_HANDLERS,
    JwtStrategy,
  ],
  exports: [],
})
export class AuthModule extends ConfigurableModuleClass {}
