import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ValidateUserCommand } from '../contracts'
import { AuthService } from '../../auth.service'
import { User } from '@prisma/client'

@CommandHandler(ValidateUserCommand)
export class ValidateUserHandler
  implements ICommandHandler<ValidateUserCommand>
{
  constructor(private readonly authService: AuthService) {}

  execute(command: ValidateUserCommand): Promise<User | null> {
    const { credentials } = command
    return this.authService.validateUser(credentials)
  }
}
