import {
  LoginHandler,
  ValidatePasswordHandler,
  ValidateUserHandler,
} from './handlers'

export const HANDLERS = [
  ValidateUserHandler,
  ValidatePasswordHandler,
  LoginHandler,
]
