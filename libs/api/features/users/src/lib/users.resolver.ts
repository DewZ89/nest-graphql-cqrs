import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserCreateInput } from './inputs'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateUserCommand } from './commands/contracts'
import { UserInfo } from '../dtos'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { GetUsersQuery } from './queries/contracts'
import { from, map, Observable } from 'rxjs'
import { User } from '@prisma/client'

@Resolver()
@UseInterceptors(ClassSerializerInterceptor)
export class UsersResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Mutation('createUser')
  createUser(@Args('data') data: UserCreateInput): Observable<UserInfo> {
    return from(this.commandBus.execute(new CreateUserCommand(data))).pipe(
      map((user) => new UserInfo(user))
    )
  }

  @Query('users')
  getUsers(): Observable<UserInfo[]> {
    return from(this.queryBus.execute(new GetUsersQuery())).pipe(
      map((users: User[]) => users.map((user) => new UserInfo(user)))
    )
  }
}
