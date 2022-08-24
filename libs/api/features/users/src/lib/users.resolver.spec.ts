import { Test, TestingModule } from '@nestjs/testing'
import { UsersResolver } from './users.resolver'
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { UserCreateInput } from './inputs'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { UserInfo } from '../dtos'
import { User } from '@prisma/client'

const commandBusMock = mockDeep<CommandBus>() as DeepMockProxy<CommandBus>
const queryBusMock = mockDeep<QueryBus>() as DeepMockProxy<QueryBus>

describe('UsersResolver', () => {
  let resolver: UsersResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        { provide: CommandBus, useValue: commandBusMock },
        { provide: QueryBus, useValue: queryBusMock },
      ],
    }).compile()

    resolver = module.get<UsersResolver>(UsersResolver)
  })

  beforeEach(() => mockReset(commandBusMock))

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('create user', () => {
    it('should create a user', (done) => {
      // Given
      const data: UserCreateInput = {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'secret',
      }
      const { name, email } = data
      const expected = {
        name,
        email,
        id: 1,
        createdAt: new Date(),
      } as UserInfo
      commandBusMock.execute.mockResolvedValue(expected)

      // When..Then
      resolver.createUser(data).subscribe((result) => {
        expect(result).toEqual(expected)
        expect(commandBusMock.execute).toHaveBeenCalledTimes(1)
        done()
      })
    })

    describe('query users', () => {
      const mockUsers = [
        {
          name: 'Jane Doe',
          password: 'secret',
          createdAt: new Date(),
          id: 1,
          email: 'janedoe@example.com',
        },
        {
          name: 'John Doe',
          password: 'secret',
          createdAt: new Date(),
          id: 1,
          email: 'johndoe@example.com',
        },
      ] as User[]

      describe('get users', () => {
        it('should return users', (done) => {
          // Given
          queryBusMock.execute.mockResolvedValue(mockUsers)

          // When
          resolver.getUsers().subscribe((results) => {
            expect(results).toEqual(mockUsers)
            expect(queryBusMock.execute).toHaveBeenCalledTimes(1)
            done()
          })
        })
      })
    })
  })
})
