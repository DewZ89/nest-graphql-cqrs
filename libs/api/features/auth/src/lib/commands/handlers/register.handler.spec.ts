import { RegisterHandler } from './register.handler'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockClear, mockDeep } from 'jest-mock-extended'
import { AuthService } from '../../auth.service'
import { UserCreateInput, UsersService } from '@blog/api/features/users'
import { RegisterCommand } from '../contracts'
import { User } from '@prisma/client'

const authServiceMock = mockDeep<AuthService>() as DeepMockProxy<AuthService>
const usersServiceMock = mockDeep<UsersService>() as DeepMockProxy<UsersService>

describe('RegisterHandler', () => {
  let handler: RegisterHandler

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterHandler,
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile()

    handler = module.get<RegisterHandler>(RegisterHandler)
  })

  beforeEach(() => {
    mockClear(authServiceMock)
    mockClear(usersServiceMock)
  })

  describe('execute', () => {
    it('should return an auth token', async () => {
      // Given
      const data: UserCreateInput = {
        name: 'John Doe',
        password: 'password',
        email: 'doe@exmple.com',
      }
      const command = new RegisterCommand({ ...data })
      const userMock: User = { ...data, id: 1, createdAt: new Date() }
      const token = { accessToken: 'token' }
      usersServiceMock.create.mockResolvedValue(userMock)
      authServiceMock.login.mockReturnValue(token)

      // When..Then
      await expect(handler.execute(command)).resolves.toEqual(token)
      expect(usersServiceMock.create).toHaveBeenCalledWith(data)
      expect(authServiceMock.login).toHaveBeenCalledWith(userMock)
    })
  })
})
