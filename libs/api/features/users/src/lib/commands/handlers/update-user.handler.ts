import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateUserCommand } from '../contracts'
import { UsersService } from '../../users.service'
import { User } from '@prisma/client'

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly usersService: UsersService) {}

  execute(command: UpdateUserCommand): Promise<User> {
    const { where, data } = command
    return this.usersService.update(where, data)
  }
}
