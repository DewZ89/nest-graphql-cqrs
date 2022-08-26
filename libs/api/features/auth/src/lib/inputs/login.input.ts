import { IsEmail, IsString } from 'class-validator'

export class LoginInput {
  @IsString()
  @IsEmail()
  email!: string

  @IsString()
  password!: string
}
