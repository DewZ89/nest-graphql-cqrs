import { Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { from, Observable } from 'rxjs'
import { Token } from './dtos'
import { CurrentUser } from './decorators'
import { User } from '@prisma/client'
import { CommandBus } from '@nestjs/cqrs'
import { LoginCommand } from './commands/contracts'

@Resolver()
export class AuthResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation()
  @UseGuards(LocalAuthGuard)
  login(@CurrentUser() user: User): Observable<Token> {
    return from(this.commandBus.execute(new LoginCommand(user)))
  }
}
