import { Test } from '@nestjs/testing'
import { UsersService } from './users.service'
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaService } from '@blog/api/shared/prisma'
import { Prisma, User } from '@prisma/client'
import { NotFoundError } from '@prisma/client/runtime'

const prismaServiceMock =
  mockDeep<PrismaService>() as DeepMockProxy<PrismaService>

const mockUserData = [
  {
    name: 'John Doe',
    email: 'johndoe@example.com',
    id: 1,
    createdAt: new Date(),
  },
  {
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    id: 2,
    createdAt: new Date(),
  },
] as User[]

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile()

    service = module.get(UsersService)
  })

  beforeEach(() => mockReset(prismaServiceMock))

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })

  describe('create users', () => {
    it('should create a user with valid data', (done) => {
      const data = {
        name: 'John Doe',
        email: 'johndoe@example.com',
      } as Prisma.UserCreateInput

      const expected = { ...data, id: 1, createdAt: new Date() } as User
      prismaServiceMock.user.create.mockResolvedValue(expected)

      service.create(data).subscribe((result) => {
        expect(result.name).toBe(expected.name)
        expect(result.email).toBe(expected.email)
        done()
      })
    })
  })

  describe('get users', () => {
    it('should get all users', (done) => {
      prismaServiceMock.user.findMany.mockResolvedValue(mockUserData)
      service.findMany().subscribe((results) => {
        expect(results).toBe(mockUserData)
        done()
      })
    })

    it('should get user matching criteria', (done) => {
      const where: Prisma.UserWhereInput = { id: 1 }
      const expected = mockUserData.filter((user) => user.id === where.id)
      prismaServiceMock.user.findMany.mockResolvedValue(expected)
      service.findMany(where).subscribe((results) => {
        expect(results).toBe(expected)
        done()
      })
    })
  })

  describe('get user', () => {
    it('should get user matching id', (done) => {
      // Given
      const where: Prisma.UserWhereUniqueInput = { id: 1 }
      const expected = mockUserData.find((user) => user.id === where.id) as User
      prismaServiceMock.user.findUniqueOrThrow.mockResolvedValue(expected)

      // When
      service.findUniqueOrThrow(where).subscribe((result) => {
        // Then
        expect(result).toEqual(expected)
        done()
      })
    })

    it('should throw a NotFoundError exception if no user match id', (done) => {
      // Given
      const where: Prisma.UserWhereUniqueInput = { id: 1 }
      prismaServiceMock.user.findUniqueOrThrow.mockRejectedValue(
        new NotFoundError('Not Found!')
      )
      // When
      service.findUniqueOrThrow(where).subscribe({
        error: (error) => {
          // Then
          expect(error).toBeInstanceOf(NotFoundError)
          done()
        },
      })
    })
  })

  describe('update user', () => {
    it('should update user matching id', (done) => {
      // Given
      const updateData: Prisma.UserUpdateInput = {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
      }
      const where: Prisma.UserWhereUniqueInput = { id: 1 }
      const expected: User = {
        ...updateData,
        id: 1,
        createdAt: new Date(),
      } as User
      prismaServiceMock.user.update.mockResolvedValue(expected)

      // When
      service.update(where, updateData).subscribe((result) => {
        expect(result).toEqual(expected)
        done()
      })
    })

    it('should throw a NotFoundError exception if id invalid', (done) => {
      // Given
      const updateData: Prisma.UserUpdateInput = {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
      }
      const where: Prisma.UserWhereUniqueInput = { id: 1 }
      prismaServiceMock.user.update.mockRejectedValue(
        new NotFoundError('Not Found!')
      )

      // When
      service.update(where, updateData).subscribe({
        error: (error) => {
          // Then
          expect(error).toBeInstanceOf(NotFoundError)
          done()
        },
      })
    })
  })
})
