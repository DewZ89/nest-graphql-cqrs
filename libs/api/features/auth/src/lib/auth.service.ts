import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { LoginInput } from './inputs/login.input'
import { GetUserQuery, ValidatePasswordCommand } from '@blog/api/features/users'
import { User } from '@prisma/client'
import { Token } from './dtos'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(data: LoginInput): Promise<User | null> {
    try {
      const user = await this.queryBus.execute(
        new GetUserQuery({ email: data.email })
      )

      return (await this.commandBus.execute(
        new ValidatePasswordCommand(data.password, user.password)
      ))
        ? user
        : null
    } catch (e) {
      return null
    }
  }

  login(user: User): Token {
    const payload = { email: user.email, sub: user.id }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}
