import { Prisma } from '@prisma/client'

export class UpdateUserCommand {
  constructor(
    public readonly where: Prisma.UserWhereUniqueInput,
    public readonly data: Prisma.UserUpdateInput
  ) {}
}
