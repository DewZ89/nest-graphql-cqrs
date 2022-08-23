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
})
