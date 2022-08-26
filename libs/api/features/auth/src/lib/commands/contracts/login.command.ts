import { User } from '@prisma/client'

export class LoginCommand {
  constructor(public readonly user: User) {}
}
