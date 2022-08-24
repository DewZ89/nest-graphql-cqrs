import { Test } from '@nestjs/testing'
import { UsersService } from './users.service'
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaService } from '@blog/api/shared/prisma'
import { Prisma, User } from '@prisma/client'

const prismaServiceMock =
  mockDeep<PrismaService>() as DeepMockProxy<PrismaService>

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
    const data = [
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

    it('should get all users', (done) => {
      prismaServiceMock.user.findMany.mockResolvedValue(data)
      service.findMany().subscribe((results) => {
        expect(results).toBe(data)
        done()
      })
    })

    it('should get user matching criteria', (done) => {
      const where: Prisma.UserWhereInput = { id: 1 }
      const expected = data.filter((user) => user.id === where.id)
      prismaServiceMock.user.findMany.mockResolvedValue(expected)
      service.findMany(where).subscribe((results) => {
        expect(results).toBe(expected)
        done()
      })
    })
  })
})
