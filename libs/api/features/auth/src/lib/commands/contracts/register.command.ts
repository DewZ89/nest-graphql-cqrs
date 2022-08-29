import { UserCreateInput } from '@blog/api/features/users'

export class RegisterCommand {
  constructor(public readonly data: UserCreateInput) {}
}
