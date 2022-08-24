import { Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'

@Injectable()
export class PasswordService {
  async hash(token: string): Promise<string> {
    return argon2.hash(token)
  }

  async verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password)
  }
}
