import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { User } from '@prisma/client'
import { CommandBus } from '@nestjs/cqrs'
import { ValidateUserCommand } from '../commands/contracts'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly commandBus: CommandBus) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<User | null> {
    const user = await this.commandBus.execute(
      new ValidateUserCommand({ email, password })
    )

    if (!user) throw new UnauthorizedException('Bad credentials!')

    return user
  }
}
