import { LoginInput } from '../../inputs/login.input'

export class ValidateUserCommand {
  constructor(public readonly credentials: LoginInput) {}
}
