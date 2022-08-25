import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetUserQuery } from '../contracts'
import { UsersService } from '../../services/users.service'
import { User } from '@prisma/client'

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly usersService: UsersService) {}

  execute(query: GetUserQuery): Promise<User> {
    const { where } = query
    return this.usersService.findUniqueOrThrow(where)
  }
}
