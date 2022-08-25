import { Prisma } from '@prisma/client'

export class GetUserQuery {
  constructor(public readonly where: Prisma.UserWhereUniqueInput) {}
}
