import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ValidatePasswordCommand } from '../contracts'
import { PasswordService } from '../../services/password.service'

@CommandHandler(ValidatePasswordCommand)
export class ValidatePasswordHandler
  implements ICommandHandler<ValidatePasswordCommand>
{
  constructor(private readonly passwordService: PasswordService) {}

  execute(command: ValidatePasswordCommand): Promise<boolean> {
    const { password, hash } = command
    return this.passwordService.verify(hash, password)
  }
}
