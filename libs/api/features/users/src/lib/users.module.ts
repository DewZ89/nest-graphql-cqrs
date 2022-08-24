import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { PrismaModule } from '@blog/api/shared/prisma'
import { HANDLERS as QUERY_HANDLERS } from './queries'
import { HANDLERS as COMMAND_HANDLERS } from './commands'

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    UsersService,
    UsersResolver,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
  ],
  exports: [],
})
export class UsersModule {}
