import { IsOptional, IsString, MinLength } from 'class-validator'
import { Prisma } from '@prisma/client'

export class UserUpdateInput
  implements Partial<Omit<Prisma.UserCreateInput, 'createdAt'>>
{
  @IsOptional()
  @IsString()
  @MinLength(5)
  email?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  @MinLength(5)
  password?: string
}
