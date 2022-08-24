import { Injectable } from '@nestjs/common'
import { PrismaService } from '@blog/api/shared/prisma'
import { Prisma, User } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data })
  }

  findMany(where?: Prisma.UserWhereInput): Promise<User[]> {
    return this.prismaService.user.findMany({ where })
  }

  findUniqueOrThrow(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({ where })
  }

  update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    return this.prismaService.user.update({ data, where })
  }
}
