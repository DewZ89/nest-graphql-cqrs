import { Test, TestingModule } from '@nestjs/testing'
import { AuthResolver } from './auth.resolver'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { CommandBus } from '@nestjs/cqrs'
import { User } from '@prisma/client'
import { Token } from './dtos'

const commandBusMock = mockDeep<CommandBus>() as DeepMockProxy<CommandBus>

describe('AuthResolver', () => {
  let resolver: AuthResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: CommandBus, useValue: commandBusMock },
      ],
    }).compile()

    resolver = module.get<AuthResolver>(AuthResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('login', () => {
    it('should return auth token if user found', (done) => {
      // Given
      const user = { email: 'janedoe@example.com', id: 1 } as User
      const token: Token = { accessToken: 'token' }
      commandBusMock.execute.mockResolvedValue(token)

      // When..Then
      resolver.login(user).subscribe((result) => {
        expect(result).toEqual(token)
        done()
      })
    })
  })
})
