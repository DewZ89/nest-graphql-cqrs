import { CreateUserHandler } from './create-user.handler'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { UsersService } from '../../users.service'
import { User } from '@prisma/client'
import { CreateUserCommand } from '../contracts'

const usersServiceMock = mockDeep<UsersService>() as DeepMockProxy<UsersService>

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile()

    handler = module.get<CreateUserHandler>(CreateUserHandler)
  })

  it('should be defined', () => {
    expect(handler).toBeDefined()
  })

  it('should create a user when command is called', async () => {
    // Given
    const expected = {
      createdAt: new Date(),
      email: 'janedoe@example.com',
      name: 'Jane Doe',
    } as User
    const command = new CreateUserCommand({
      createdAt: expected.createdAt,
      email: expected.email,
      name: expected.name,
      password: 'secret',
    })
    usersServiceMock.create.mockResolvedValue(expected)

    // When..Then
    await expect(handler.execute(command)).resolves.toEqual(expected)
  })
})
