import {
  LoginHandler,
  RegisterHandler,
  ValidatePasswordHandler,
  ValidateUserHandler,
} from './handlers'

export const HANDLERS = [
  ValidateUserHandler,
  ValidatePasswordHandler,
  LoginHandler,
  RegisterHandler,
]
