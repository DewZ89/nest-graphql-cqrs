import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetUserQuery } from '../contracts'
import { UsersService } from '@blog/api/features/users'
import { User } from '@prisma/client'

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly usersService: UsersService) {}

  execute(query: GetUserQuery): Promise<User> {
    const { email } = query
    return this.usersService.findUniqueOrThrow({ email })
  }
}
