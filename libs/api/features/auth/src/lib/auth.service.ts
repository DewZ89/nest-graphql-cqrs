import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { LoginInput } from './inputs/login.input'
import { GetUserQuery, ValidatePasswordCommand } from '@blog/api/features/users'
import { User } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
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
}
