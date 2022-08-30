import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { JwtGuard, LocalAuthGuard } from './guards'
import { from, map, Observable } from 'rxjs'
import { Token } from './dtos'
import { CurrentUser } from './decorators'
import { User } from '@prisma/client'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { LoginCommand, RegisterCommand } from './commands/contracts'
import { UserCreateInput, UserInfo } from '@blog/api/features/users'
import { GetUserQuery } from './queries/contracts'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Mutation()
  @UseGuards(LocalAuthGuard)
  login(@CurrentUser() user: User): Observable<Token> {
    return from(this.commandBus.execute(new LoginCommand(user)))
  }

  @Mutation()
  register(@Args('data') data: UserCreateInput): Observable<Token> {
    return from(this.commandBus.execute(new RegisterCommand(data)))
  }

  @Query('me')
  @UseGuards(JwtGuard)
  getCurrentUser(@CurrentUser() user: User): Observable<UserInfo> {
    return from(this.queryBus.execute(new GetUserQuery(user.email))).pipe(
      map((user) => new UserInfo(user))
    )
  }
}
