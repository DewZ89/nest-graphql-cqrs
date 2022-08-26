import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { LoginCommand } from '../contracts'
import { AuthService } from '@blog/api/features/auth'
import { Token } from '../../dtos'

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginCommand): Promise<Token> {
    const { user } = command
    return this.authService.login(user)
  }
}
