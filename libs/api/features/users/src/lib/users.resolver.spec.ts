import { Test, TestingModule } from '@nestjs/testing'
import { UsersResolver } from './users.resolver'
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { UserCreateInput } from './inputs'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { UserInfo } from './dtos'
import { User } from '@prisma/client'
import { NotFoundError } from '@prisma/client/runtime'
import { NotFoundException } from '@nestjs/common'
import { UserUpdateInput } from './inputs/user-update.input'

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

      describe('get user', () => {
        it('should return user matching id', (done) => {
          // Given
          const id = 1
          const expected = mockUsers.find((user) => user.id === id)
          queryBusMock.execute.mockResolvedValue(expected)

          // @hen..Then
          resolver.getUser(id).subscribe((result) => {
            expect(result).toEqual(expected)
            done()
          })
        })

        it('should throw NotFoundException if id is valid', (done) => {
          // Given
          const id = 1
          queryBusMock.execute.mockRejectedValue(
            new NotFoundError('Not found!')
          )

          // @hen..Then
          resolver.getUser(id).subscribe({
            error: (error) => {
              expect(error).toBeInstanceOf(NotFoundException)
              done()
            },
          })
        })
      })
    })

    describe('update user', () => {
      it('should update user matching id', (done) => {
        // Given
        const id = 1
        const data: UserUpdateInput = {
          name: 'Jane Doe',
          email: 'new@example.com',
        }
        const expected = {
          ...data,
          createdAt: new Date(),
          id,
          password: '$argon2secret',
        } as User
        commandBusMock.execute.mockResolvedValue(expected)

        // When..Then
        resolver.updateUser(id, data).subscribe((result) => {
          expect(result).toEqual(expected)
          expect(commandBusMock.execute).toHaveBeenCalledTimes(1)
          done()
        })
      })

      it('should return NotFoundException if id invalid', (done) => {
        // Given
        const id = 1
        const data: UserUpdateInput = {
          password: 'secretpassword',
        }

        commandBusMock.execute.mockRejectedValue(
          new NotFoundError('Not found!')
        )

        // When..Then
        resolver.updateUser(id, data).subscribe({
          error: (error) => {
            expect(error).toBeInstanceOf(NotFoundException)
            done()
          },
        })
      })
    })
  })
})
