import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserCommand } from '../contracts'
import { UsersService } from '../../users.service'
import { User } from '@prisma/client'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userService: UsersService) {}

  execute(command: CreateUserCommand): Promise<User> {
    const { data } = command
    return this.userService.create(data)
  }
}
