export class ValidatePasswordCommand {
  constructor(public readonly password: string, public readonly hash: string) {}
}
