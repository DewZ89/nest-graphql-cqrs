import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ValidatePasswordCommand } from '../contracts'
import { PasswordService } from '@blog/api/features/users'

@CommandHandler(ValidatePasswordCommand)
export class ValidatePasswordHandler
  implements ICommandHandler<ValidatePasswordCommand>
{
  constructor(private readonly passwordService: PasswordService) {}

  execute(command: ValidatePasswordCommand): Promise<boolean> {
    const { hash, password } = command
    return this.passwordService.verify(hash, password)
  }
}
