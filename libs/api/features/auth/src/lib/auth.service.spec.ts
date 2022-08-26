import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { DeepMockProxy, mockClear, mockDeep } from 'jest-mock-extended'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { User } from '@prisma/client'
import { LoginInput } from './inputs/login.input'
import { NotFoundError } from '@prisma/client/runtime'

const commandBusMock = mockDeep<CommandBus>() as DeepMockProxy<CommandBus>
const queryBusMock = mockDeep<QueryBus>() as DeepMockProxy<QueryBus>

describe('ApiFeaturesAuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CommandBus, useValue: commandBusMock },
        { provide: QueryBus, useValue: queryBusMock },
      ],
    }).compile()

    service = module.get(AuthService)
  })

  beforeEach(() => {
    mockClear(commandBusMock)
    mockClear(queryBusMock)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })

  describe('validate user', () => {
    it('should return user matching valid credentials', async () => {
      // Given
      const expected: User = {
        id: 1,
        name: 'John Doe',
        email: 'test@example.com',
        createdAt: new Date(),
        password: '$argon2isecretpassword',
      }
      const credentials: LoginInput = {
        email: expected.email,
        password: 'secret',
      }
      queryBusMock.execute.mockResolvedValue(expected)
      commandBusMock.execute.mockResolvedValue(true)

      // When..Then
      await expect(service.validateUser(credentials)).resolves.toEqual(expected)
    })

    it('should return null if email is invalid', async () => {
      // Given
      const wrongCredentials: LoginInput = {
        email: 'fake.email@example.com',
        password: 'secret',
      }
      queryBusMock.execute.mockRejectedValue(new NotFoundError('Not Found!'))

      // When..Then
      await expect(service.validateUser(wrongCredentials)).resolves.toBeNull()
    })

    it('should return null if password is invalid', async () => {
      // Given
      const wrongCredentials: LoginInput = {
        email: 'email@example.com',
        password: 'fakepassword',
      }
      queryBusMock.execute.mockRejectedValue(new NotFoundError('Not Found!'))
      commandBusMock.execute.mockResolvedValue(false)

      // When..Then
      await expect(service.validateUser(wrongCredentials)).resolves.toBeNull()
    })
  })
})
