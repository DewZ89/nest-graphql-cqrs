import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserCreateInput } from './inputs'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateUserCommand, UpdateUserCommand } from './commands/contracts'
import { UserInfo } from './dtos'
import {
  ClassSerializerInterceptor,
  NotFoundException,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common'
import { GetUserQuery, GetUsersQuery } from './queries/contracts'
import { catchError, from, map, Observable, throwError } from 'rxjs'
import { User } from '@prisma/client'
import { UserUpdateInput } from './inputs/user-update.input'

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

  @Query('user')
  getUser(@Args('id', ParseIntPipe) id: number): Observable<UserInfo> {
    return from(this.queryBus.execute(new GetUserQuery(id))).pipe(
      map((user) => new UserInfo(user)),
      catchError(() =>
        throwError(() => new NotFoundException('No user match given id'))
      )
    )
  }

  @Mutation('updateUser')
  updateUser(
    @Args('id', ParseIntPipe) id: number,
    @Args('data') data: UserUpdateInput
  ): Observable<UserInfo> {
    return from(
      this.commandBus.execute(new UpdateUserCommand({ id }, data))
    ).pipe(
      map((user) => new UserInfo(user)),
      catchError(() =>
        throwError(() => new NotFoundException('No user match given id'))
      )
    )
  }
}
