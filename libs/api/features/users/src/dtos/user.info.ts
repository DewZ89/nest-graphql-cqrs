import { User } from '@prisma/client'
import { Exclude } from 'class-transformer'

export class UserInfo implements User {
  id!: number
  name!: string
  email!: string
  createdAt!: Date

  @Exclude()
  password!: string

  constructor(partial: Omit<User, 'password'>) {
    Object.assign(this, partial)
  }
}
