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

  findMany(where?: Prisma.UserWhereInput): Observable<User[]> {
    return from(this.prismaService.user.findMany({ where }))
  }

  findUniqueOrThrow(where: Prisma.UserWhereUniqueInput): Observable<User> {
    return from(this.prismaService.user.findUniqueOrThrow({ where }))
  }

  update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ): Observable<User> {
    return from(this.prismaService.user.update({ data, where }))
  }
}
