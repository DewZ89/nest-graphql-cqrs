import { Test, TestingModule } from '@nestjs/testing'
import { LocalStrategy } from './local.strategy'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { LoginInput } from '../inputs/login.input'
import { User } from '@prisma/client'
import { CommandBus } from '@nestjs/cqrs'
import { UnauthorizedException } from '@nestjs/common'

const commandBusMock = mockDeep<CommandBus>() as DeepMockProxy<CommandBus>

describe('LocalStrategy', () => {
  let provider: LocalStrategy

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: CommandBus, useValue: commandBusMock },
      ],
    }).compile()

    provider = module.get<LocalStrategy>(LocalStrategy)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })

  describe('validate', () => {
    it('should return user if credentials are valid', async () => {
      // Given
      const credentials = {
        email: 'test@example.com',
        password: 'password',
      } as LoginInput
      const expected = {
        email: credentials.email,
        password: '$argon2ipassword',
        name: 'Jane Doe',
      } as User
      commandBusMock.execute.mockResolvedValue(expected)

      // When..Then
      await expect(
        provider.validate(credentials.email, credentials.password)
      ).resolves.toEqual(expected)
      expect(commandBusMock.execute).toHaveBeenCalledTimes(1)
    })

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      // Given
      const credentials = {
        email: 'test@example.com',
        password: 'password',
      } as LoginInput
      const expected = null
      commandBusMock.execute.mockResolvedValue(expected)

      // When..Then
      await expect(
        provider.validate(credentials.email, credentials.password)
      ).rejects.toThrow(UnauthorizedException)
    })
  })
})
