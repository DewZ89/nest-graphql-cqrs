import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload, ParsedJwtPayload } from '../types/jwt-payload.type'
import { MODULE_OPTIONS_TOKEN } from '../auth.module-definition'
import { AuthModuleOptions } from '../types/auth-module-options.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: AuthModuleOptions) {
    super({
      secretOrKey: options.jwtSecretKey,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  validate(payload: JwtPayload): ParsedJwtPayload {
    return {
      id: payload.sub,
      email: payload.email,
    }
  }
}
