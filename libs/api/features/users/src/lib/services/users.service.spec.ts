import { Test } from '@nestjs/testing'
import { UsersService } from './users.service'
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaService } from '@blog/api/shared/prisma'
import { Prisma, User } from '@prisma/client'
import { NotFoundError } from '@prisma/client/runtime'
import { PasswordService } from './password.service'

const prismaServiceMock =
  mockDeep<PrismaService>() as DeepMockProxy<PrismaService>
const passwordService =
  mockDeep<PasswordService>() as DeepMockProxy<PasswordService>
const passwordHash = '$argon2ipasswordhash'

const mockUserData = [
  {
    name: 'John Doe',
    email: 'johndoe@example.com',
    id: 1,
    password: 'secret',
    createdAt: new Date(),
  },
  {
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    id: 2,
    password: 'secret',
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
        { provide: PasswordService, useValue: passwordService },
      ],
    }).compile()

    service = module.get(UsersService)
  })

  beforeEach(() => mockReset(prismaServiceMock))

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })

  describe('create users', () => {
    it('should create a user with valid data', async () => {
      const data = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'secret',
      } as Prisma.UserCreateInput

      const expected = {
        ...data,
        id: 1,
        createdAt: new Date(),
        password: passwordHash,
      } as User
      prismaServiceMock.user.create.mockResolvedValue(expected)
      passwordService.hash.mockResolvedValue(passwordHash)

      await expect(service.create(data)).resolves.toEqual(expected)
      await expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: {
          ...data,
          password: passwordHash,
        },
      })
    })
  })

  describe('get users', () => {
    it('should get all users', async () => {
      // Given
      prismaServiceMock.user.findMany.mockResolvedValue(mockUserData)

      // When...Then
      await expect(service.findMany()).resolves.toEqual(mockUserData)
    })

    it('should get user matching criteria', async () => {
      // Given
      const where: Prisma.UserWhereInput = { id: 1 }
      const expected = mockUserData.filter((user) => user.id === where.id)
      prismaServiceMock.user.findMany.mockResolvedValue(expected)

      // When...Then
      await expect(service.findMany(where)).resolves.toEqual(expected)
    })
  })

  describe('get user', () => {
    it('should get user matching id', async () => {
      // Given
      const where: Prisma.UserWhereUniqueInput = { id: 1 }
      const expected = mockUserData.find((user) => user.id === where.id) as User
      prismaServiceMock.user.findUniqueOrThrow.mockResolvedValue(expected)

      // When..Then
      await expect(service.findUniqueOrThrow(where)).resolves.toEqual(expected)
    })

    it('should throw a NotFoundError exception if no user match id', async () => {
      // Given
      const where: Prisma.UserWhereUniqueInput = { id: 1 }
      prismaServiceMock.user.findUniqueOrThrow.mockRejectedValue(
        new NotFoundError('Not Found!')
      )
      // When..Then
      await expect(service.findUniqueOrThrow(where)).rejects.toBeInstanceOf(
        NotFoundError
      )
    })
  })

  describe('update user', () => {
    it('should update user matching id', async () => {
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

      // When..Then
      await expect(service.update(where, updateData)).resolves.toEqual(expected)
    })

    it('should update user password if provided', async () => {
      // Given
      const updateData: Prisma.UserUpdateInput = {
        name: 'Jane Doe',
        password: 'newpassword',
      }
      const where: Prisma.UserWhereUniqueInput = { id: 1 }
      const expected: User = {
        ...updateData,
        id: 1,
        createdAt: new Date(),
        password: passwordHash,
      } as User
      prismaServiceMock.user.update.mockResolvedValue(expected)
      passwordService.hash.mockResolvedValue(passwordHash)

      // When..Then
      await expect(service.update(where, updateData)).resolves.toEqual(expected)
      await expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        data: {
          ...updateData,
          password: passwordHash,
        },
        where,
      })
    })

    it('should throw a NotFoundError exception if id invalid', async () => {
      // Given
      const updateData: Prisma.UserUpdateInput = {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
      }
      const where: Prisma.UserWhereUniqueInput = { id: 1 }
      prismaServiceMock.user.update.mockRejectedValue(
        new NotFoundError('Not Found!')
      )

      // When..Then
      await expect(service.update(where, updateData)).rejects.toBeInstanceOf(
        NotFoundError
      )
    })
  })
})
