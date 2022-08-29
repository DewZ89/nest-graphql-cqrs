export class ValidatePasswordCommand {
  constructor(public readonly hash: string, public readonly password: string) {}
}
