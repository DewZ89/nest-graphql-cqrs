import { Test, TestingModule } from '@nestjs/testing'
import { JwtStrategy } from './jwt.strategy'
import { JwtPayload, ParsedJwtPayload } from '../types/jwt-payload.type'
import { MODULE_OPTIONS_TOKEN } from '../auth.module-definition'
import { AuthModuleOptions } from '../types/auth-module-options.interface'

describe('JwtStrategy', () => {
  let provider: JwtStrategy
  const moduleOptions: AuthModuleOptions = { jwtSecretKey: 'secretkey' }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: MODULE_OPTIONS_TOKEN, useValue: moduleOptions },
      ],
    }).compile()

    provider = module.get<JwtStrategy>(JwtStrategy)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })

  describe('validate', () => {
    it('should return a parsed jwt payload', () => {
      // Given
      const payload: JwtPayload = { email: 'johndoe@example.com', sub: 1 }
      const expected: ParsedJwtPayload = {
        email: payload.email,
        id: payload.sub,
      }

      // When..Then
      expect(provider.validate(payload)).toEqual(expected)
    })
  })
})
