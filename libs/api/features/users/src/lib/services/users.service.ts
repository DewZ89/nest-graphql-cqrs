import { Injectable } from '@nestjs/common'
import { PrismaService } from '@blog/api/shared/prisma'
import { Prisma, User } from '@prisma/client'
import { PasswordService } from './password.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const passwordHash = await this.passwordService.hash(data.password)
    return this.prismaService.user.create({
      data: { ...data, password: passwordHash },
    })
  }

  findMany(where?: Prisma.UserWhereInput): Promise<User[]> {
    return this.prismaService.user.findMany({ where })
  }

  findUniqueOrThrow(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({ where })
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    let updateData: Prisma.UserUpdateInput = { ...data }

    if (data.password) {
      const hash = await this.passwordService.hash(data.password.toString())
      updateData = { ...data, password: hash }
    }

    return this.prismaService.user.update({ data: updateData, where })
  }
}
