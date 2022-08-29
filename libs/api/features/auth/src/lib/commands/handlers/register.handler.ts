import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RegisterCommand } from '../contracts'
import { UsersService } from '@blog/api/features/users'
import { AuthService } from '../../auth.service'
import { Token } from '../../dtos'

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  async execute(command: RegisterCommand): Promise<Token> {
    const { data } = command
    const user = await this.usersService.create(data)
    return this.authService.login(user)
  }
}
