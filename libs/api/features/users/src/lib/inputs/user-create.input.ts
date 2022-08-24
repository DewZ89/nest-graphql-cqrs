import { Prisma } from '@prisma/client'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class UserCreateInput
  implements Omit<Prisma.UserCreateInput, 'createdAt'>
{
  @IsString()
  @MinLength(5)
  name!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(5)
  password!: string
}
