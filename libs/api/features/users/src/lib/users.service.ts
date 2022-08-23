import { Injectable } from '@nestjs/common'
import { PrismaService } from '@blog/api/shared/prisma'
import { Prisma, User } from '@prisma/client'
import { from, Observable } from 'rxjs'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.UserCreateInput): Observable<User> {
    return from(this.prismaService.user.create({ data }))
  }
}
