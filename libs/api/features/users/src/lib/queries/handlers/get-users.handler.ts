import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetUsersQuery } from '../contracts'
import { UsersService } from '../../services/users.service'
import { User } from '@prisma/client'

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly usersService: UsersService) {}

  execute(): Promise<User[]> {
    return this.usersService.findMany()
  }
}
